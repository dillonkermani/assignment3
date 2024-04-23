"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from .common import db, session, T, cache, auth, logger, authenticated, unauthenticated, flash
from py4web.utils.url_signer import URLSigner
from .models import get_user_email

url_signer = URLSigner(session)

@action('index')
@action.uses('index.html', db, auth.user)
def index():
    return dict(
        # For example...
        load_products_url = URL('load_products'),
        add_product_url = URL('add_product'),
        delete_product_url = URL('delete_product'),
        purchase_product_url = URL('purchase_product'),
    )



@action('load_products')
@action.uses(db, auth.user)
def load_products():
    rows = db(db.products.user_email == get_user_email()).select().as_list()
    return dict(products=rows)

@action('add_product', method='POST')
@action.uses(db, session, auth.user)
def add_product():
    name = request.json.get('name')
    purchased = request.json.get('purchased')
    id = db.products.insert(name=name, purchased=purchased)
    return dict(id=id)


