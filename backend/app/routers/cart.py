from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_cart():
    return {"message": "Cart route working"}
