import json
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.deps import get_current_user
from app.models.user import User
from app.db.redis_client import redis_client

router = APIRouter()

CART_TTL = 3600  # 1 hour

class AddItemRequest(BaseModel):
    product_id: int
    qty: int
    price: float
    name: str

def get_cart_from_redis(user_id: int) -> dict:
    cart = redis_client.get(f"cart:{user_id}")
    if cart:
        return json.loads(cart)
    return {"items": [], "total": 0}

def save_cart_to_redis(user_id: int, cart: dict):
    redis_client.setex(f"cart:{user_id}", CART_TTL, json.dumps(cart))

@router.get("/")
def get_cart(current_user: User = Depends(get_current_user)):
    return get_cart_from_redis(current_user.id)

@router.post("/items")
def add_to_cart(item: AddItemRequest, current_user: User = Depends(get_current_user)):
    cart = get_cart_from_redis(current_user.id)
    # If product already in cart, increase quantity
    for existing in cart["items"]:
        if existing["product_id"] == item.product_id:
            existing["qty"] += item.qty
            break
    else:
        # Product not in cart yet, add it
        cart["items"].append({
            "product_id": item.product_id,
            "name": item.name,
            "qty": item.qty,
            "price": item.price
        })
    # Recalculate total
    cart["total"] = round(sum(i["qty"] * i["price"] for i in cart["items"]), 2)
    save_cart_to_redis(current_user.id, cart)
    return cart

@router.delete("/items/{product_id}")
def remove_from_cart(product_id: int, current_user: User = Depends(get_current_user)):
    cart = get_cart_from_redis(current_user.id)
    cart["items"] = [i for i in cart["items"] if i["product_id"] != product_id]
    cart["total"] = round(sum(i["qty"] * i["price"] for i in cart["items"]), 2)
    save_cart_to_redis(current_user.id, cart)
    return cart

@router.delete("/")
def clear_cart(current_user: User = Depends(get_current_user)):
    redis_client.delete(f"cart:{current_user.id}")
    return {"message": "Cart cleared", "items": [], "total": 0}
