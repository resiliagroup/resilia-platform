"""
OMNI Risk Intelligence Engine
API Dependencies — auth, tenant extraction
"""
import uuid
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

from app.core.config import settings

security = HTTPBearer()


async def get_current_tenant(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
) -> uuid.UUID:
    """
    Extracts tenant_id from JWT bearer token.
    Token must contain: {"sub": "<tenant_id>", ...}
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.secret_key,
            algorithms=[settings.algorithm],
        )
        tenant_id_str: str = payload.get("sub")
        if tenant_id_str is None:
            raise credentials_exception
        return uuid.UUID(tenant_id_str)
    except (JWTError, ValueError):
        raise credentials_exception
