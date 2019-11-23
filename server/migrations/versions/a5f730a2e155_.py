"""empty message

Revision ID: a5f730a2e155
Revises: c8d318085d95
Create Date: 2019-11-23 15:23:06.911165

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a5f730a2e155'
down_revision = 'c8d318085d95'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('postings', sa.Column('images', sa.ARRAY(sa.String(length=128)), nullable=True))
    op.alter_column('postings', 'room',
               existing_type=sa.VARCHAR(length=50),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('postings', 'room',
               existing_type=sa.VARCHAR(length=50),
               nullable=True)
    op.drop_column('postings', 'images')
    # ### end Alembic commands ###