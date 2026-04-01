from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class OrderItem(BaseModel):
    product_id: int
    qty: int
    price: float

class OrderCreate(BaseModel):
    items: List[OrderItem]
    shipping_address: str

class OrderOut(BaseModel):
    id: int
    user_id: int
    status: str
    total_amount: float
    items: list
    shipping_address: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
