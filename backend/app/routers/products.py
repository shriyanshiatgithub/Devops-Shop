import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db.redis_client import redis_client
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductOut

router = APIRouter()

CACHE_TTL = 300  # 5 minutes

@router.get("/", response_model=List[ProductOut])
def get_products(db: Session = Depends(get_db)):
    # Try cache first
    cached = redis_client.get("products:all")
    if cached:
        return json.loads(cached)
    # Not in cache — get from database
    products = db.query(Product).all()
    result = [ProductOut.from_orm(p).dict() for p in products]
    # Store in Redis for 5 minutes
    redis_client.setex("products:all", CACHE_TTL, json.dumps(result, default=str))
    return products

@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    cached = redis_client.get(f"product:{product_id}")
    if cached:
        return json.loads(cached)
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    result = ProductOut.from_orm(product).dict()
    redis_client.setex(f"product:{product_id}", CACHE_TTL, json.dumps(result, default=str))
    return product

@router.post("/", response_model=ProductOut, status_code=201)
def create_product(product_data: ProductCreate, db: Session = Depends(get_db)):
    product = Product(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    redis_client.delete("products:all")
    return product

@router.put("/{product_id}", response_model=ProductOut)
def update_product(product_id: int, product_data: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for field, value in product_data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    redis_client.delete("products:all")
    redis_client.delete(f"product:{product_id}")
    return product

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    redis_client.delete("products:all")
    redis_client.delete(f"product:{product_id}")
    return {"message": "Product deleted"}
