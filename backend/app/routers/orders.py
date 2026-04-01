from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.order import OrderCreate, OrderOut
from app.models.order import Order
from app.models.product import Product
from app.core.deps import get_current_user
from app.models.user import User
from app.db.redis_client import redis_client

router = APIRouter()

@router.post("/", response_model=OrderOut, status_code=201)
def place_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total = 0
    items_snapshot = []

    # Check every item before saving anything
    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.stock < item.qty:
            raise HTTPException(status_code=400, detail=f"Not enough stock for {product.name}")
        # Deduct stock
        product.stock -= item.qty
        total += item.qty * item.price
        # Snapshot item details at order time
        items_snapshot.append({
            "product_id": item.product_id,
            "name": product.name,
            "qty": item.qty,
            "price": item.price
        })

    # Save order to PostgreSQL
    order = Order(
        user_id=current_user.id,
        total_amount=round(total, 2),
        items=items_snapshot,
        shipping_address=order_data.shipping_address
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # Clear cart from Redis after successful order
    redis_client.delete(f"cart:{current_user.id}")

    return order

@router.get("/", response_model=List[OrderOut])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    orders = db.query(Order).filter(Order.user_id == current_user.id).all()
    return orders
