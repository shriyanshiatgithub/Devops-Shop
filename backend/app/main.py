from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from app.routers import auth, products, cart, orders

app = FastAPI(
    title="DevOps Shop API",
    description="Backend API for DevOps E-Commerce Platform",
    version="1.0.0"
)

# CORS configuration (important for frontend connection)
origins = [
    "http://localhost:3000",  # React frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(cart.router, prefix="/cart", tags=["Cart"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])


# Health check (important for Kubernetes later)
@app.get("/")
def root():
    return {"message": "DevOps Shop API is running 🚀"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
