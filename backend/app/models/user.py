import uuid
from datetime import datetime

from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID
from sqlalchemy import Boolean, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "users"

    credits: Mapped[int] = mapped_column(Integer, default=3)
    subscription_tier: Mapped[str] = mapped_column(
        String(20), default="free"
    )  # free, starter, pro
    subscription_expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="user", uselist=False, lazy="selectin"
    )
    generations: Mapped[list["Generation"]] = relationship(
        "Generation", back_populates="user", lazy="selectin"
    )


# Import here to avoid circular imports
from app.models.profile import Profile
from app.models.generation import Generation
