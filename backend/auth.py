from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

# Blueprint setup
auth_bp = Blueprint('auth', __name__)

# Explicitly enable CORS for this blueprint
CORS(auth_bp)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    # Import db and User model from main app
    from app import db, User
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Validate required fields
    if not username or not email or not password:
        return jsonify({'message': 'All fields required!'}), 400

    # Check if email already registered
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already registered.'}), 400

    # Hash password and create new user
    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'Signup successful!'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    # Import db and User model from main app
    from app import db, User
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Find user by email
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid credentials.'}), 401

    return jsonify({
        'message': f'Welcome, {user.username}! Login successful.',
        'username': user.username
    }), 200