from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    category: Optional[str] = None
    image_url: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    category: Optional[str] = None
    image_url: Optional[str] = None

class ProductOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    stock: int
    category: Optional[str]
    image_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
