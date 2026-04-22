import uuid
from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True
    )
    full_name: Mapped[str] = mapped_column(String(200))
    email: Mapped[str | None] = mapped_column(String(320), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    address: Mapped[str | None] = mapped_column(String(300), nullable=True)
    city: Mapped[str] = mapped_column(String(100), default="Toulouse")
    age: Mapped[str | None] = mapped_column(String(20), nullable=True)
    permis: Mapped[str | None] = mapped_column(String(50), nullable=True)
    vehicule: Mapped[str | None] = mapped_column(String(100), nullable=True)
    photo_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    gender: Mapped[str] = mapped_column(
        String(10), default="male"
    )  # male, female
    cv_template: Mapped[str] = mapped_column(String(20), default="classic")
    skills: Mapped[list] = mapped_column(JSON, default=list)
    languages: Mapped[list] = mapped_column(JSON, default=list)
    soft_skills: Mapped[list] = mapped_column(JSON, default=list)
    custom_instructions: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="profile")
    education: Mapped[list["Education"]] = relationship(
        "Education",
        back_populates="profile",
        lazy="selectin",
        cascade="all, delete-orphan",
        order_by="Education.sort_order",
    )
    experiences: Mapped[list["Experience"]] = relationship(
        "Experience",
        back_populates="profile",
        lazy="selectin",
        cascade="all, delete-orphan",
        order_by="Experience.sort_order",
    )


class Education(Base):
    __tablename__ = "education"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4
    )
    profile_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("profiles.id", ondelete="CASCADE")
    )
    title: Mapped[str] = mapped_column(String(300))
    school: Mapped[str] = mapped_column(String(300))
    location: Mapped[str | None] = mapped_column(String(200), nullable=True)
    dates: Mapped[str | None] = mapped_column(String(100), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    profile: Mapped["Profile"] = relationship("Profile", back_populates="education")


class Experience(Base):
    __tablename__ = "experiences"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4
    )
    profile_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("profiles.id", ondelete="CASCADE")
    )
    title: Mapped[str] = mapped_column(String(300))
    company: Mapped[str] = mapped_column(String(300))
    location: Mapped[str | None] = mapped_column(String(200), nullable=True)
    dates: Mapped[str | None] = mapped_column(String(100), nullable=True)
    bullets: Mapped[list] = mapped_column(JSON, default=list)
    is_locked: Mapped[bool] = mapped_column(Boolean, default=False)
    custom_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    profile: Mapped["Profile"] = relationship("Profile", back_populates="experiences")


from app.models.user import User
