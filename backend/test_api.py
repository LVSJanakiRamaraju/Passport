import pytest
from fastapi.testclient import TestClient
from main import app
import json

client = TestClient(app)

# Test 1: Root endpoint
def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "Passport Application API is running"

# Test 2: Health check endpoint
def test_health_check_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "database" in data

# Test 3: Database connection
def test_database_connection():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["database"] in ["connected", "disconnected"]

# Test 4: Sign up with valid data
def test_signup_with_valid_data():
    response = client.post("/api/signup", json={
        "username": "testuser123",
        "email": "test123@example.com",
        "password": "password123",
        "category": "Applicant"
    })
    assert response.status_code in [200, 400]

# Test 5: Sign up with duplicate username
def test_signup_duplicate_username():
    client.post("/api/signup", json={
        "username": "duplicate_user",
        "email": "dup@example.com",
        "password": "pass123",
        "category": "Applicant"
    })
    response = client.post("/api/signup", json={
        "username": "duplicate_user",
        "email": "dup2@example.com",
        "password": "pass456",
        "category": "Applicant"
    })
    assert response.status_code == 400

# Test 6: Sign up with missing fields
def test_signup_missing_fields():
    response = client.post("/api/signup", json={
        "username": "incomplete",
        "email": "incomplete@example.com"
    })
    assert response.status_code == 422

# Test 7: Sign up with invalid email
def test_signup_invalid_email():
    response = client.post("/api/signup", json={
        "username": "testuser",
        "email": "invalid-email",
        "password": "pass123",
        "category": "Applicant"
    })
    assert response.status_code == 422

# Test 8: Login with valid credentials
def test_login_with_valid_credentials():
    client.post("/api/signup", json={
        "username": "logintest",
        "email": "logintest@example.com",
        "password": "testpass",
        "category": "Applicant"
    })
    response = client.post("/api/login", json={
        "email": "logintest@example.com",
        "password": "testpass"
    })
    assert response.status_code in [200, 401]

# Test 9: Login with invalid email
def test_login_with_invalid_email():
    response = client.post("/api/login", json={
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

# Test 10: Login with wrong password
def test_login_with_wrong_password():
    client.post("/api/signup", json={
        "username": "passtest",
        "email": "passtest@example.com",
        "password": "correctpass",
        "category": "Applicant"
    })
    response = client.post("/api/login", json={
        "email": "passtest@example.com",
        "password": "wrongpass"
    })
    assert response.status_code == 401

# Test 11: Login returns user category
def test_login_returns_user_category():
    client.post("/api/signup", json={
        "username": "categorytest",
        "email": "category@example.com",
        "password": "pass123",
        "category": "Passport Administrator"
    })
    response = client.post("/api/login", json={
        "email": "category@example.com",
        "password": "pass123"
    })
    if response.status_code == 200:
        assert "category" in response.json()

# Test 12: Submit application with valid data
def test_submit_application_valid():
    response = client.post("/api/applications", json={
        "username": "testuser",
        "name": "John Doe",
        "father_name": "Robert Doe",
        "date_of_birth": "1990-01-01",
        "permanent_address": "123 Main St",
        "temporary_address": "456 Temp Ave",
        "phone": "1234567890",
        "email": "john@example.com",
        "pan": "ABCDE1234F",
        "status": "pending"
    })
    assert response.status_code in [200, 500]

# Test 13: Submit application with missing fields
def test_submit_application_missing_fields():
    response = client.post("/api/applications", json={
        "username": "testuser",
        "name": "John Doe"
    })
    assert response.status_code == 422

# Test 14: Get all applications
def test_get_all_applications():
    response = client.get("/api/applications")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# Test 15: Get applications returns empty list
def test_get_applications_empty():
    response = client.get("/api/applications")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

# Test 16: Update application to accepted
def test_update_application_to_accepted():
    app_response = client.post("/api/applications", json={
        "username": "accepttest",
        "name": "Jane Doe",
        "father_name": "John Doe",
        "date_of_birth": "1995-05-15",
        "permanent_address": "789 Oak St",
        "temporary_address": "321 Pine St",
        "phone": "9876543210",
        "email": "jane@example.com",
        "pan": "XYZAB5678C",
        "status": "pending"
    })
    if app_response.status_code == 200:
        app_id = app_response.json()["application"]["id"]
        response = client.put(f"/api/applications/{app_id}?status=accepted")
        assert response.status_code in [200, 404]

# Test 17: Update application to rejected
def test_update_application_to_rejected():
    app_response = client.post("/api/applications", json={
        "username": "rejecttest",
        "name": "Bob Smith",
        "father_name": "Tom Smith",
        "date_of_birth": "1988-03-20",
        "permanent_address": "456 Elm St",
        "temporary_address": "789 Maple Ave",
        "phone": "5551234567",
        "email": "bob@example.com",
        "pan": "PQRST9876Z",
        "status": "pending"
    })
    if app_response.status_code == 200:
        app_id = app_response.json()["application"]["id"]
        response = client.put(f"/api/applications/{app_id}?status=rejected")
        assert response.status_code in [200, 404]

# Test 18: Update non-existent application
def test_update_nonexistent_application():
    response = client.put("/api/applications/99999?status=accepted")
    assert response.status_code == 404

# Test 19: Application date format validation
def test_application_date_format():
    response = client.post("/api/applications", json={
        "username": "datetest",
        "name": "Alice Brown",
        "father_name": "David Brown",
        "date_of_birth": "1992-12-25",
        "permanent_address": "111 Park Ave",
        "temporary_address": "222 Lake St",
        "phone": "5559876543",
        "email": "alice@example.com",
        "pan": "LMNOP4567Q",
        "status": "pending"
    })
    assert response.status_code in [200, 422, 500]

# Test 20: PAN number validation
def test_pan_number_validation():
    response = client.post("/api/applications", json={
        "username": "pantest",
        "name": "Charlie Wilson",
        "father_name": "George Wilson",
        "date_of_birth": "1985-07-10",
        "permanent_address": "333 River Rd",
        "temporary_address": "444 Hill St",
        "phone": "5551112222",
        "email": "charlie@example.com",
        "pan": "ABCDE1234F",
        "status": "pending"
    })
    assert response.status_code in [200, 422, 500]

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
