# Implementation Plan Checklist

## Original Question/Task

**Question:** <h1>Insurance Claim Processing System</h1>

<h2>Overview</h2>
<p>You are tasked with developing a basic Insurance Claim Processing application that allows customers to submit insurance claims and agents to process these claims. The application will consist of a Spring Boot backend and a React frontend. The backend will handle data storage and business logic, while the frontend will provide an intuitive user interface for both customers and agents.</p>

<h2>Question Requirements</h2>

<h3>Backend Requirements (Spring Boot)</h3>

<h4>1. Data Models</h4>
<p>Create the following entities with appropriate relationships:</p>
<ul>
    <li><b>Customer</b>
        <ul>
            <li><code>customerId</code> (Long): Primary key</li>
            <li><code>name</code> (String): Customer's full name</li>
            <li><code>email</code> (String): Customer's email address</li>
            <li><code>phoneNumber</code> (String): Customer's phone number</li>
            <li><code>policyNumber</code> (String): Customer's insurance policy number</li>
        </ul>
    </li>
    <li><b>Claim</b>
        <ul>
            <li><code>claimId</code> (Long): Primary key</li>
            <li><code>customerId</code> (Long): Foreign key referencing Customer</li>
            <li><code>claimType</code> (String): Type of claim (e.g., "Health", "Auto", "Property")</li>
            <li><code>claimAmount</code> (Double): Amount claimed</li>
            <li><code>incidentDate</code> (LocalDate): Date when the incident occurred</li>
            <li><code>description</code> (String): Description of the claim</li>
            <li><code>status</code> (String): Status of the claim (e.g., "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED")</li>
            <li><code>submissionDate</code> (LocalDate): Date when the claim was submitted</li>
        </ul>
    </li>
</ul>

<h4>2. RESTful API Endpoints</h4>

<h5>Customer Endpoints</h5>
<ul>
    <li><code>POST /api/customers</code>: Create a new customer
        <ul>
            <li>Request Body: Customer details (name, email, phoneNumber, policyNumber)</li>
            <li>Response: Created customer with status code 201</li>
            <li>Validation: Email must be valid format, all fields are required</li>
            <li>Error Response: Status code 400 with error message for validation failures</li>
        </ul>
        <p>Example Request:</p>
        <pre><code>
{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890",
    "policyNumber": "POL-12345"
}
        </code></pre>
    </li>
    <li><code>GET /api/customers</code>: Get all customers
        <ul>
            <li>Response: List of all customers with status code 200</li>
            <li>Error Response: Status code 500 with error message for server errors</li>
        </ul>
    </li>
    <li><code>GET /api/customers/{customerId}</code>: Get customer by ID
        <ul>
            <li>Path Variable: customerId</li>
            <li>Response: Customer details with status code 200</li>
            <li>Error Response: Status code 404 if customer not found</li>
        </ul>
    </li>
</ul>

<h5>Claim Endpoints</h5>
<ul>
    <li><code>POST /api/claims</code>: Submit a new claim
        <ul>
            <li>Request Body: Claim details (customerId, claimType, claimAmount, incidentDate, description)</li>
            <li>Response: Created claim with status code 201</li>
            <li>Processing: Automatically sets status to "SUBMITTED" and submissionDate to current date</li>
            <li>Validation: customerId must exist, claimAmount must be positive, all fields are required</li>
            <li>Error Response: Status code 400 with error message for validation failures, 404 if customer not found</li>
        </ul>
        <p>Example Request:</p>
        <pre><code>
{
    "customerId": 1,
    "claimType": "Health",
    "claimAmount": 1500.00,
    "incidentDate": "2023-10-15",
    "description": "Emergency room visit due to high fever"
}
        </code></pre>
    </li>
    <li><code>GET /api/claims</code>: Get all claims
        <ul>
            <li>Response: List of all claims with status code 200</li>
            <li>Error Response: Status code 500 with error message for server errors</li>
        </ul>
    </li>
    <li><code>GET /api/claims/{claimId}</code>: Get claim by ID
        <ul>
            <li>Path Variable: claimId</li>
            <li>Response: Claim details with status code 200</li>
            <li>Error Response: Status code 404 if claim not found</li>
        </ul>
    </li>
    <li><code>GET /api/customers/{customerId}/claims</code>: Get all claims for a customer
        <ul>
            <li>Path Variable: customerId</li>
            <li>Response: List of claims for the specified customer with status code 200</li>
            <li>Error Response: Status code 404 if customer not found</li>
        </ul>
    </li>
    <li><code>PUT /api/claims/{claimId}/status</code>: Update claim status (for agents)
        <ul>
            <li>Path Variable: claimId</li>
            <li>Request Body: New status (must be one of: "UNDER_REVIEW", "APPROVED", "REJECTED")</li>
            <li>Response: Updated claim with status code 200</li>
            <li>Validation: Status must be valid, claim must exist</li>
            <li>Error Response: Status code 400 for invalid status, 404 if claim not found</li>
        </ul>
        <p>Example Request:</p>
        <pre><code>
{
    "status": "APPROVED"
}
        </code></pre>
    </li>
</ul>

<h4>3. Service Layer</h4>
<p>Implement service classes to handle business logic:</p>
<ul>
    <li><b>CustomerService</b>: Handle customer-related operations</li>
    <li><b>ClaimService</b>: Handle claim-related operations, including validation and status updates</li>
</ul>

<h4>4. Exception Handling</h4>
<p>Implement a global exception handler to handle the following exceptions:</p>
<ul>
    <li>ResourceNotFoundException: When a requested resource (customer or claim) is not found</li>
    <li>ValidationException: When input validation fails</li>
    <li>All other exceptions: Return appropriate error messages and status codes</li>
</ul>

<h3>Frontend Requirements (React)</h3>

<h4>1. Components</h4>
<p>Create the following React components:</p>

<h5>Customer Components</h5>
<ul>
    <li><b>CustomerRegistration</b>: Form to register a new customer
        <ul>
            <li>Fields: name, email, phoneNumber, policyNumber</li>
            <li>Validation: All fields required, email format validation</li>
            <li>Submit button to create customer</li>
            <li>Success/error messages after submission</li>
        </ul>
    </li>
    <li><b>CustomerList</b>: Display list of all customers
        <ul>
            <li>Table with columns: Customer ID, Name, Email, Policy Number</li>
            <li>Click on a customer to view their details</li>
        </ul>
    </li>
    <li><b>CustomerDetail</b>: Display details of a selected customer
        <ul>
            <li>Show all customer information</li>
            <li>Show list of claims submitted by this customer</li>
            <li>Button to submit a new claim for this customer</li>
        </ul>
    </li>
</ul>

<h5>Claim Components</h5>
<ul>
    <li><b>ClaimSubmission</b>: Form to submit a new claim
        <ul>
            <li>Fields: customerId (dropdown of existing customers), claimType (dropdown with options: "Health", "Auto", "Property"), claimAmount, incidentDate, description</li>
            <li>Validation: All fields required, claimAmount must be positive</li>
            <li>Submit button to create claim</li>
            <li>Success/error messages after submission</li>
        </ul>
    </li>
    <li><b>ClaimList</b>: Display list of all claims
        <ul>
            <li>Table with columns: Claim ID, Customer Name, Claim Type, Amount, Status, Submission Date</li>
            <li>Filter option to filter claims by status</li>
            <li>Click on a claim to view its details</li>
        </ul>
    </li>
    <li><b>ClaimDetail</b>: Display details of a selected claim
        <ul>
            <li>Show all claim information</li>
            <li>For agent view: Include dropdown to update claim status with options "UNDER_REVIEW", "APPROVED", "REJECTED"</li>
            <li>Submit button to update status</li>
            <li>Success/error messages after status update</li>
        </ul>
    </li>
</ul>

<h4>2. Routing</h4>
<p>Implement routing using React Router with the following routes:</p>
<ul>
    <li><code>/</code>: Home page with navigation links</li>
    <li><code>/customers</code>: CustomerList component</li>
    <li><code>/customers/new</code>: CustomerRegistration component</li>
    <li><code>/customers/:id</code>: CustomerDetail component</li>
    <li><code>/claims</code>: ClaimList component</li>
    <li><code>/claims/new</code>: ClaimSubmission component</li>
    <li><code>/claims/:id</code>: ClaimDetail component</li>
</ul>

<h4>3. API Integration</h4>
<p>Create a service layer to interact with the backend API:</p>
<ul>
    <li><b>CustomerService</b>: Methods to fetch, create, and update customers</li>
    <li><b>ClaimService</b>: Methods to fetch, create, and update claims</li>
</ul>

<h4>4. Error Handling</h4>
<p>Implement error handling for API calls:</p>
<ul>
    <li>Display appropriate error messages to users</li>
    <li>Handle network errors and server errors gracefully</li>
</ul>

<h3>Database</h3>
<p>Use MySQL as the backend database. The application should automatically create the necessary tables based on the entity definitions.</p>

<h3>Testing</h3>
<p>Your solution will be evaluated based on the following criteria:</p>
<ul>
    <li>Correct implementation of all required features</li>
    <li>Proper error handling and validation</li>
    <li>Code organization and structure</li>
    <li>API functionality and correctness</li>
    <li>UI functionality and user experience</li>
</ul>

<p>Note: Focus on implementing the core functionality first before adding any additional features.</p>

**Created:** 2025-07-29 05:33:04
**Total Steps:** 13

## Detailed Step Checklist

### Step 1: Read Spring Boot project dependencies and analyze backend boilerplate structure
- [x] **Status:** ✅ Completed
- **Files to modify:**
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp/pom.xml
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp/src/main/resources/application.properties
- **Description:** This step ensures familiarity with project structure and available backend dependencies, validates that all required libraries are present for subsequent implementation (entities, validation, persistence, REST, etc).

### Step 2: Implement Data Models (Entities) for Customer and Claim
- [x] **Status:** ✅ Completed
- **Files to create:**
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp/src/main/java/com/examly/springapp/model/Customer.java
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp/src/main/java/com/examly/springapp/model/Claim.java
- **Description:** Establishes persistent data models with all required fields and relationships. Sets up validation to ensure reliable data storage and input checking as per requirements. Supports test cases such as creating, fetching, and relating customers and claims.

### Step 3: Create Repositories for Customer and Claim
- [x] **Status:** ✅ Completed
- **Files to create:**
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp/src/main/java/com/examly/springapp/repository/CustomerRepository.java
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp/src/main/java/com/examly/springapp/repository/ClaimRepository.java
- **Description:** Allows data access and persistence for business services and controllers through simple repository pattern.

### Step 4: Implement Exception Handling Infrastructure
- [x] **Status:** ✅ Completed
- **Files to create:**
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp/src/main/java/com/examly/springapp/exception/GlobalExceptionHandler.java
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp/src/main/java/com/examly/springapp/exception/ResourceNotFoundException.java
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp/src/main/java/com/examly/springapp/exception/ValidationException.java
- **Description:** Provides robust, user-friendly error handling for REST APIs, crucial for satisfying validation and resource-not-found requirements and supporting the error scenarios tested in test cases.

### Step 5: Develop Service Layer for Business Logic (CustomerService and ClaimService)
- [x] **Status:** ✅ Completed
- **Files to create:**
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp/src/main/java/com/examly/springapp/service/CustomerService.java
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp/src/main/java/com/examly/springapp/service/ClaimService.java
- **Description:** Centralizes business logic, ensures constraints and validation are enforced for API endpoints to support positive and negative test cases.

### Step 6: Create Controllers with All Required REST Endpoints
- [x] **Status:** ✅ Completed
- **Files to create:**
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp/src/main/java/com/examly/springapp/controller/CustomerController.java
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp/src/main/java/com/examly/springapp/controller/ClaimController.java
- **Description:** Implements all required endpoints for customer and claim management. REST endpoints must support all described functionality and support error handling for frontend and testing.

### Step 7: Configure CORS to Allow Frontend Integration
- [x] **Status:** ✅ Completed
- **Files to create:**
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp/src/main/java/com/examly/springapp/WebConfig.java
- **Files to modify:**
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp/src/main/java/com/examly/springapp/InsuranceClaimProcessingSystemApplication.java
- **Description:** Allows smooth development and communication between frontend (React) and backend (Spring Boot). Required for React API calls to be permitted.

### Step 8: Implement All Backend JUnit Test Cases (Controllers/Service Layer)
- [x] **Status:** ✅ Completed
- **Files to create:**
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp/src/test/java/com/examly/springapp/controller/CustomerControllerTest.java
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp/src/test/java/com/examly/springapp/controller/ClaimControllerTest.java
- **Files to modify:**
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/springapp/src/test/java/com/examly/springapp/InsuranceClaimProcessingSystemApplicationTests.java
- **Description:** Ensures each backend endpoint behaves as required, validations and error handling are correct, and all controller logic is robust. Supports all JUnit scenarios from testcases JSON.

### Step 9: Compile and Run Backend (Spring Boot) Tests
- [x] **Status:** ✅ Completed
- **Description:** Validates Spring Boot code compiles and passes all required JUnit test cases.

### Step 10: Read and analyze React frontend dependencies and structure
- [x] **Status:** ✅ Completed
- **Files to modify:**
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/package.json
- **Description:** Ensures correct setup for adding UI components, routing, style and service utilities, and test files.

### Step 11: Implement UI and API Services: Customer and Claim Components
- [x] **Status:** ✅ Completed
- **Files to create:**
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/components/CustomerRegistration.js
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/components/CustomerList.js
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/components/CustomerDetail.js
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/components/ClaimSubmission.js
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/components/ClaimList.js
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/components/ClaimDetail.js
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/utils/CustomerService.js
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/utils/ClaimService.js
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/components/CustomerRegistration.css
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/components/CustomerList.css
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/components/CustomerDetail.css
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/components/ClaimSubmission.css
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/components/ClaimList.css
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/components/ClaimDetail.css
- **Files to modify:**
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/App.js
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/App.css
- **Description:** Delivers all functional frontend UI for customer and claim workflows, with correct API integration, React Router setup, validation, and style.

### Step 12: Implement All Jest Test Cases for React Components
- [ ] **Status:** ⏳ Not Started
- **Files to create:**
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/components/CustomerRegistration.test.js
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/components/ClaimList.test.js
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/components/ClaimDetail.test.js
  - /home/coder/project/workspace/question_generation_service/solutions/9a8816a7-f944-417c-b621-880c521e5fc9/reactapp/src/components/CustomerDetail.test.js
- **Description:** Ensures UI components are tested for all required behaviors and edge cases following the provided test expectations using Jest and React Testing Library.

### Step 13: Lint, Compile, and Test React Frontend
- [ ] **Status:** ⏳ Not Started
- **Description:** Validates that the React frontend builds, passes all style and code standards, and passes all tests derived from the test cases JSON.

## Completion Status

| Step | Status | Completion Time |
|------|--------|----------------|
| Step 1 | ✅ Completed | 2025-07-29 05:33:18 |
| Step 2 | ✅ Completed | 2025-07-29 05:33:33 |
| Step 3 | ✅ Completed | 2025-07-29 05:33:49 |
| Step 4 | ✅ Completed | 2025-07-29 05:34:12 |
| Step 5 | ✅ Completed | 2025-07-29 05:34:41 |
| Step 6 | ✅ Completed | 2025-07-29 05:35:26 |
| Step 7 | ✅ Completed | 2025-07-29 05:35:39 |
| Step 8 | ✅ Completed | 2025-07-29 05:36:19 |
| Step 9 | ✅ Completed | 2025-07-29 05:47:06 |
| Step 10 | ✅ Completed | 2025-07-29 05:47:52 |
| Step 11 | ✅ Completed | 2025-07-29 05:51:36 |
| Step 12 | ⏳ Not Started | - |
| Step 13 | ⏳ Not Started | - |

## Notes & Issues

### Errors Encountered
- None yet

### Important Decisions
- Step 11: All React customer/claim components and utilities implemented as required, CSS present, App.js/App.css wired, ready for testing phase.

### Next Actions
- Begin implementation following the checklist
- Use `update_plan_checklist_tool` to mark steps as completed
- Use `read_plan_checklist_tool` to check current status

### Important Instructions
- Don't Leave any placeholders in the code.
- Do NOT mark compilation and testing as complete unless EVERY test case is passing. Double-check that all test cases have passed successfully before updating the checklist. If even a single test case fails, compilation and testing must remain incomplete.
- Do not mark the step as completed until all the sub-steps are completed.

---
*This checklist is automatically maintained. Update status as you complete each step using the provided tools.*