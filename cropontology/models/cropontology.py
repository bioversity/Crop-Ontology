# coding: utf-8
from sqlalchemy import (
    Column,
    DateTime,
    INTEGER,
    text,
    Unicode,
    UnicodeText,
    ForeignKey,
)

from .meta import Base
from sqlalchemy.orm import relationship

metadata = Base.metadata


class User(Base):
    __tablename__ = "user"

    user_id = Column(Unicode(120), primary_key=True)
    user_name = Column(Unicode(120))
    user_email = Column(Unicode(120))
    user_password = Column(UnicodeText)
    user_about = Column(UnicodeText)
    user_cdate = Column(DateTime)
    user_llogin = Column(DateTime)
    user_super = Column(INTEGER, server_default=text("'0'"))
    user_active = Column(INTEGER, server_default=text("'1'"))
    user_apikey = Column(Unicode(64))
    tags = Column(UnicodeText)
    extras = Column(UnicodeText)

    user_password_reset_key = Column(Unicode(64))
    user_password_reset_token = Column(Unicode(64))
    user_password_reset_expires_on = Column(DateTime)

class Page(Base):
    __tablename__ = "page"

    page_id = Column(Unicode(120), primary_key=True)
    page_desc = Column(Unicode(120))
    page_fixed = Column(INTEGER, server_default=text("'0'"))
    page_lastupdate = Column(DateTime)
    page_content = Column(UnicodeText)
    extras = Column(UnicodeText)


class Section(Base):
    __tablename__ = "section"

    section_id = Column(Unicode(120), primary_key=True)
    section_desc = Column(Unicode(120))
    section_fixed = Column(INTEGER, server_default=text("'0'"))
    section_lastupdate = Column(DateTime)
    section_content = Column(UnicodeText)
    extras = Column(UnicodeText)


class UserSection(Base):
    __tablename__ = "usersection"

    user_id = Column(
        ForeignKey("user.user_id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
    )
    section_id = Column(
        ForeignKey("section.section_id", ondelete="CASCADE"),
        primary_key=True,
        nullable=False,
        index=True,
    )
    access_date = Column(DateTime)

    section = relationship("Section")
    user = relationship("User")


class Menu(Base):
    __tablename__ = "menu"

    menu_id = Column(Unicode(120), primary_key=True)
    menu_desc = Column(Unicode(120))
    menu_fixed = Column(INTEGER, server_default=text("'0'"))
    menu_content = Column(UnicodeText)
    extras = Column(UnicodeText)
