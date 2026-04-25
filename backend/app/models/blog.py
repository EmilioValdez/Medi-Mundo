from sqlalchemy import Column, Integer, String, Text, Boolean, Date
from app.database import Base


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    resumen = Column(String(300))
    contenido = Column(Text, nullable=False)
    categoria = Column(String(100))
    tags = Column(String(500))
    imagen_principal = Column(String(300))
    alt_imagen = Column(String(200))
    fecha_publicacion = Column(Date)
    actualizado = Column(Date)
    activo = Column(Boolean, default=True)
    meta_title = Column(String(70))
    meta_description = Column(String(170))
