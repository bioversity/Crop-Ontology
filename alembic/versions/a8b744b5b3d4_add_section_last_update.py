"""Add section last update

Revision ID: a8b744b5b3d4
Revises: ee885074f87a
Create Date: 2020-09-14 14:35:04.246184

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "a8b744b5b3d4"
down_revision = "ee885074f87a"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "section", sa.Column("section_lastupdate", sa.DateTime(), nullable=True)
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("section", "section_lastupdate")
    # ### end Alembic commands ###