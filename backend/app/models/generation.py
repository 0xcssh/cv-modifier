import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    JSON,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Generation(Base):
    __tablename__ = "generations"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE")
    )
    job_url: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    job_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    job_title: Mapped[str | None] = mapped_column(String(300), nullable=True)
    company_name: Mapped[str | None] = mapped_column(String(300), nullable=True)
    adapted_data: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    cv_pdf_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    cover_letter_pdf_path: Mapped[str | None] = mapped_column(
        String(500), nullable=True
    )
    profile_snapshot: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    model_used: Mapped[str | None] = mapped_column(String(100), nullable=True)
    tokens_used: Mapped[int | None] = mapped_column(Integer, nullable=True)
    cost_estimate: Mapped[Decimal | None] = mapped_column(
        Numeric(6, 4), nullable=True
    )
    status: Mapped[str] = mapped_column(
        String(20), default="pending"
    )  # pending, processing, completed, failed
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="generations")
    credit_transaction: Mapped["CreditTransaction | None"] = relationship(
        "CreditTransaction", back_populates="generation", uselist=False
    )


class CreditTransaction(Base):
    __tablename__ = "credit_transactions"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE")
    )
    amount: Mapped[int] = mapped_column(Integer)  # positive=added, negative=spent
    reason: Mapped[str] = mapped_column(String(100))  # generation, purchase, signup_bonus
    generation_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("generations.id"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    generation: Mapped["Generation | None"] = relationship(
        "Generation", back_populates="credit_transaction"
    )


from app.models.user import User
