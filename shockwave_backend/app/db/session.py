from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings


engine = None
AsyncSessionLocal = None

if settings.sqlalchemy_database_uri:
    engine = create_async_engine(
        settings.sqlalchemy_database_uri,
        echo=settings.debug,
        pool_pre_ping=True,
    )

    AsyncSessionLocal = async_sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
    )


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    if AsyncSessionLocal is None:
        raise RuntimeError("Database access requested, but DATABASE_ENABLED is false.")

    async with AsyncSessionLocal() as session:
        yield session
