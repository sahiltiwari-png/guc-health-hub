1) in this page http://localhost:8080/patient-registration please integrate these apis also without any issue 

V1 - PatientRegistrationAndVisitedRoute
Enterprise APIs for patient registration and visits



GET
/api/v1/patients
Method Summary


Retrieves a paginated list of all patients

Parameters
Try it out
Name	Description
page
integer($int32)
(query)
Default value : 0

0
size
integer($int32)
(query)
Default value : 10

10
sort
array[string]
(query)
Default value : List [ "id", "desc" ]

id
desc
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "totalElements": 9007199254740991,
    "totalPages": 1073741824,
    "first": true,
    "last": true,
    "size": 1073741824,
    "content": [
      {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "gender": "Male",
        "dateOfBirth": "1990-01-01",
        "phoneNumber": "+919876543210",
        "email": "john.doe@example.com",
        "address": "123",
        "uhid": "UHID123456",
        "maritalStatus": "Single",
        "bloodGroup": "O+",
        "guardianName": "Jane Doe",
        "guardianPhone": "+919876543211",
        "emergencyContactName": "Jane Doe",
        "emergencyContactPhone": "+919876543211",
        "occupation": "Software Engineer",
        "religion": "None",
        "nationality": "Indian",
        "patientImage": null,
        "familyHeadId": null,
        "relationshipWithHead": "Self",
        "active": true
      }
    ],
    "number": 1073741824,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "pageable": {
      "offset": 9007199254740991,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "pageSize": 1073741824,
      "pageNumber": 1073741824,
      "paged": true,
      "unpaged": true
    },
    "numberOfElements": 1073741824,
    "empty": true
  },
  "timestamp": "2026-05-24T04:11:10.169Z"
}
No links

GET
/api/v1/patients/{id}
Method Summary


Retrieves a patient's details using their internal database ID

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "gender": "Male",
    "dateOfBirth": "1990-01-01",
    "phoneNumber": "+919876543210",
    "email": "john.doe@example.com",
    "address": "123",
    "uhid": "UHID123456",
    "maritalStatus": "Single",
    "bloodGroup": "O+",
    "guardianName": "Jane Doe",
    "guardianPhone": "+919876543211",
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "+919876543211",
    "occupation": "Software Engineer",
    "religion": "None",
    "nationality": "Indian",
    "patientImage": null,
    "familyHeadId": null,
    "relationshipWithHead": "Self",
    "active": true
  },
  "timestamp": "2026-05-24T04:11:10.175Z"
}
No links

PUT
/api/v1/patients/{id}
Update patient


Updates an existing patient profile

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
Request body

application/json
Example Value
Schema
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "gender": "Male",
  "dateOfBirth": "1990-01-01",
  "phoneNumber": "+919876543210",
  "email": "john.doe@example.com",
  "address": "123",
  "uhid": "UHID123456",
  "maritalStatus": "Single",
  "bloodGroup": "O+",
  "guardianName": "Jane Doe",
  "guardianPhone": "+919876543211",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+919876543211",
  "occupation": "Software Engineer",
  "religion": "None",
  "nationality": "Indian",
  "patientImage": null,
  "familyHeadId": null,
  "relationshipWithHead": "Self",
  "active": true
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "gender": "Male",
    "dateOfBirth": "1990-01-01",
    "phoneNumber": "+919876543210",
    "email": "john.doe@example.com",
    "address": "123",
    "uhid": "UHID123456",
    "maritalStatus": "Single",
    "bloodGroup": "O+",
    "guardianName": "Jane Doe",
    "guardianPhone": "+919876543211",
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "+919876543211",
    "occupation": "Software Engineer",
    "religion": "None",
    "nationality": "Indian",
    "patientImage": null,
    "familyHeadId": null,
    "relationshipWithHead": "Self",
    "active": true
  },
  "timestamp": "2026-05-24T04:11:10.178Z"
}
No links

DELETE
/api/v1/patients/{id}
Method Summary


Deletes a patient record

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {},
  "timestamp": "2026-05-24T04:11:10.180Z"
}
No links

GET
/api/v1/patients/{id}/family
Method Summary


Retrieves a list of family members for a specific patient

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "gender": "Male",
      "dateOfBirth": "1990-01-01",
      "phoneNumber": "+919876543210",
      "email": "john.doe@example.com",
      "address": "123",
      "uhid": "UHID123456",
      "maritalStatus": "Single",
      "bloodGroup": "O+",
      "guardianName": "Jane Doe",
      "guardianPhone": "+919876543211",
      "emergencyContactName": "Jane Doe",
      "emergencyContactPhone": "+919876543211",
      "occupation": "Software Engineer",
      "religion": "None",
      "nationality": "Indian",
      "patientImage": null,
      "familyHeadId": null,
      "relationshipWithHead": "Self",
      "active": true
    }
  ],
  "timestamp": "2026-05-24T04:11:10.181Z"
}
No links

POST
/api/v1/patients/patient-register
Method Summary


Registers a new patient and records their initial visit details

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "visitDate": "2026-03-09T12:24:51.597Z",
  "visitTime": "2026-03-09T12:24:51.598Z",
  "visitType": "OPD",
  "fee": 1,
  "mobile": "9876543210",
  "email": "rahul.sharma@example.com",
  "departmentId": "698334ced5bdf65d67c809bd",
  "departmentName": "General Medicine",
  "doctorId": "6981937c68d0f7fe64da7b51",
  "slot": "Slot I",
  "patientName": "Rahul Sharma",
  "gender": "Male",
  "maritalStatus": "Single",
  "dob": "1995-05-10",
  "age": 30,
  "currentAge": 30,
  "relationType": "Father",
  "guardianName": "Ramesh Sharma",
  "address": "MP Nagar Zone 2",
  "country": "India",
  "stateId": "507f1f77bcf86cd799439011",
  "cityId": "507f1f77bcf86cd799439011",
  "bloodGroup": "O+",
  "source": "Walk-in",
  "referredDoctorId": "6981937c68d0f7fe64da7b51",
  "referralMobile": "9876543210",
  "paymentMode": "Cash",
  "discountPercent": 0,
  "remark": "Regular OPD consultation",
  "patientImage": "string"
}
Responses
Code	Description	Links
201	
Patient registered and visited successfully

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {},
  "timestamp": "2026-05-24T04:11:10.184Z"
}
No links
400	
Validation or tenant context error

Media type

*/*
Examples

ValidationError
Example Value
Schema
{
  "success": false,
  "message": "Validation Failed",
  "error": null,
  "data": {
    "mobile": "Mobile number is required"
  }
}
Example Description
ValidationError


No links
401	
Unauthorized - missing or invalid JWT token

Media type

*/*
Examples

Unauthorized
Example Value
Schema
{
  "success": false,
  "message": "Unauthorized",
  "error": "Full authentication is required to access this resource",
  "data": null
}
Example Description
Unauthorized


No links

POST
/api/v1/patients/register
Register new patient


Creates a new patient profile in the system

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "gender": "Male",
  "dateOfBirth": "1990-01-01",
  "phoneNumber": "+919876543210",
  "email": "john.doe@example.com",
  "address": "123",
  "uhid": "UHID123456",
  "maritalStatus": "Single",
  "bloodGroup": "O+",
  "guardianName": "Jane Doe",
  "guardianPhone": "+919876543211",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+919876543211",
  "occupation": "Software Engineer",
  "religion": "None",
  "nationality": "Indian",
  "patientImage": null,
  "familyHeadId": null,
  "relationshipWithHead": "Self",
  "active": true
}
Responses
Code	Description	Links
200	
Patient registered successfully

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {},
  "timestamp": "2026-05-24T04:11:10.187Z"
}
No links
400	
Validation error - Check request body for missing required fields

Media type

*/*
Examples

ValidationError
Example Value
Schema
{
  "success": false,
  "message": "Validation Failed",
  "error": null,
  "data": {
    "firstName": "must not be blank"
  }
}
Example Description
ValidationError


No links
401	
Unauthorized - missing or invalid JWT token

Media type

*/*
Examples

Unauthorized
Example Value
Schema
{
  "success": false,
  "message": "Unauthorized",
  "error": "Full authentication is required to access this resource",
  "data": null
}
Example Description
Unauthorized


No links
403	
Forbidden - user lacks PATIENT_CREATE permission

Media type

*/*
Examples

Forbidden
Example Value
Schema
{
  "success": false,
  "message": "Access denied",
  "error": "Access is denied",
  "data": null
}
Example Description
Forbidden


No links

GET
/api/v1/patients/search
Search patients


Search patients by name, phone, or UHID with pagination

Parameters
Try it out
Name	Description
query *
string
(query)
query
page
integer($int32)
(query)
Default value : 0

0
size
integer($int32)
(query)
Default value : 10

10
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "totalElements": 9007199254740991,
    "totalPages": 1073741824,
    "first": true,
    "last": true,
    "size": 1073741824,
    "content": [
      {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "gender": "Male",
        "dateOfBirth": "1990-01-01",
        "phoneNumber": "+919876543210",
        "email": "john.doe@example.com",
        "address": "123",
        "uhid": "UHID123456",
        "maritalStatus": "Single",
        "bloodGroup": "O+",
        "guardianName": "Jane Doe",
        "guardianPhone": "+919876543211",
        "emergencyContactName": "Jane Doe",
        "emergencyContactPhone": "+919876543211",
        "occupation": "Software Engineer",
        "religion": "None",
        "nationality": "Indian",
        "patientImage": null,
        "familyHeadId": null,
        "relationshipWithHead": "Self",
        "active": true
      }
    ],
    "number": 1073741824,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "pageable": {
      "offset": 9007199254740991,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "pageSize": 1073741824,
      "pageNumber": 1073741824,
      "paged": true,
      "unpaged": true
    },
    "numberOfElements": 1073741824,
    "empty": true
  },
  "timestamp": "2026-05-24T04:11:10.191Z"
}
No links

GET
/api/v1/patients/search-by-phone
Search patient by phone


Finds patients based on their phone number

Parameters
Try it out
Name	Description
phoneNumber *
string
(query)
phoneNumber
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "gender": "Male",
      "dateOfBirth": "1990-01-01",
      "phoneNumber": "+919876543210",
      "email": "john.doe@example.com",
      "address": "123",
      "uhid": "UHID123456",
      "maritalStatus": "Single",
      "bloodGroup": "O+",
      "guardianName": "Jane Doe",
      "guardianPhone": "+919876543211",
      "emergencyContactName": "Jane Doe",
      "emergencyContactPhone": "+919876543211",
      "occupation": "Software Engineer",
      "religion": "None",
      "nationality": "Indian",
      "patientImage": null,
      "familyHeadId": null,
      "relationshipWithHead": "Self",
      "active": true
    }
  ],
  "timestamp": "2026-05-24T04:11:10.194Z"
}
No links

GET
/api/v1/patients/uhid/{uhid}
Method Summary


Retrieves a patient's details using their unique hospital ID

Parameters
Try it out
Name	Description
uhid *
string
(path)
uhid
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "gender": "Male",
    "dateOfBirth": "1990-01-01",
    "phoneNumber": "+919876543210",
    "email": "john.doe@example.com",
    "address": "123",
    "uhid": "UHID123456",
    "maritalStatus": "Single",
    "bloodGroup": "O+",
    "guardianName": "Jane Doe",
    "guardianPhone": "+919876543211",
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "+919876543211",
    "occupation": "Software Engineer",
    "religion": "None",
    "nationality": "Indian",
    "patientImage": null,
    "familyHeadId": null,
    "relationshipWithHead": "Self",
    "active": true
  },
  "timestamp": "2026-05-24T04:11:10.197Z"
}
2) Integrate patient filters apis in every search filter where we had filters like uhid and all tha tstuf V1 - PatientRegistrationAndVisitedRoute
Enterprise APIs for patient registration and visits

3) in this page http://localhost:8080/staff please integrate the api without any erro Admin Management
APIs for hospital administrative tasks, users, and roles



GET
/api/admin/branches
Method Summary


Retrieves all branches associated with the hospital

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {
      "id": 9007199254740991,
      "hospital": {
        "id": 9007199254740991,
        "code": "string",
        "name": "string",
        "address": "string",
        "phone": "string",
        "email": "string",
        "active": true
      },
      "name": "string",
      "code": "string",
      "address": "string",
      "phone": "string",
      "active": true
    }
  ],
  "timestamp": "2026-05-24T04:26:01.688Z"
}
No links

GET
/api/admin/roles
Method Summary


Retrieves all security roles defined in the system

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {
      "id": 9007199254740991,
      "name": "string",
      "permissions": [
        {
          "id": 9007199254740991,
          "name": "string",
          "description": "string"
        }
      ],
      "hospitalId": 9007199254740991,
      "active": true
    }
  ],
  "timestamp": "2026-05-24T04:26:01.690Z"
}
No links

GET
/api/admin/users
Method Summary


Retrieves a paginated list of all user accounts

Parameters
Try it out
Name	Description
page
integer($int32)
(query)
Default value : 0

0
size
integer($int32)
(query)
Default value : 10

10
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "totalElements": 9007199254740991,
    "totalPages": 1073741824,
    "first": true,
    "last": true,
    "size": 1073741824,
    "content": [
      {
        "id": 9007199254740991,
        "username": "string",
        "password": "string",
        "email": "string",
        "phoneNumber": "string",
        "fullName": "string",
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "roles": [
          {
            "id": 9007199254740991,
            "name": "string",
            "permissions": [
              {
                "id": 9007199254740991,
                "name": "string",
                "description": "string"
              }
            ],
            "hospitalId": 9007199254740991,
            "active": true
          }
        ],
        "active": true
      }
    ],
    "number": 1073741824,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "pageable": {
      "offset": 9007199254740991,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "pageSize": 1073741824,
      "pageNumber": 1073741824,
      "paged": true,
      "unpaged": true
    },
    "numberOfElements": 1073741824,
    "empty": true
  },
  "timestamp": "2026-05-24T04:26:01.693Z"
}
No links

GET
/api/admin/users/search
Search users


Filters users by username, full name, email, and active status

Parameters
Try it out
Name	Description
username
string
(query)
username
fullName
string
(query)
fullName
email
string
(query)
email
active
boolean
(query)

--
page
integer($int32)
(query)
Default value : 0

0
size
integer($int32)
(query)
Default value : 10

10
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "totalElements": 9007199254740991,
    "totalPages": 1073741824,
    "first": true,
    "last": true,
    "size": 1073741824,
    "content": [
      {
        "id": 9007199254740991,
        "username": "string",
        "password": "string",
        "email": "string",
        "phoneNumber": "string",
        "fullName": "string",
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "roles": [
          {
            "id": 9007199254740991,
            "name": "string",
            "permissions": [
              {
                "id": 9007199254740991,
                "name": "string",
                "description": "string"
              }
            ],
            "hospitalId": 9007199254740991,
            "active": true
          }
        ],
        "active": true
      }
    ],
    "number": 1073741824,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "pageable": {
      "offset": 9007199254740991,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "pageSize": 1073741824,
      "pageNumber": 1073741824,
      "paged": true,
      "unpaged": true
    },
    "numberOfElements": 1073741824,
    "empty": true
  },
  "timestamp": "2026-05-24T04:26:01.699Z"
}

=> in this page http://localhost:8080/attendance pelase integrate this api Staff Management
APIs for employee attendance, leaves, and payroll



GET
/api/v1/hr/attendance
Get staff attendance


Retrieves attendance logs with branch and clock-in/out filters

Parameters
Cancel
Name	Description
branchId
integer($int64)
(query)
branchId
status
string
(query)
status
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'http://localhost:5001/api/v1/hr/attendance' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzc5NTUxNDM3LCJleHAiOjE3Nzk2Mzc4Mzd9.LkGvp__0SX_qLkR1Y5UBgkdVBvp_MGfWfVvjWywzsyG4PeWS94s8gIlJtYSD0eO2'
Request URL
http://localhost:5001/api/v1/hr/attendance
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "Attendance logs found",
  "error": null,
  "data": [],
  "timestamp": "2026-05-24T10:13:56.9239575"
}
Response headers
 cache-control: no-cache,no-store,max-age=0,must-revalidate 
 connection: keep-alive 
 content-type: application/json 
 date: Sun,24 May 2026 04:43:56 GMT 
 expires: 0 
 keep-alive: timeout=60 
 pragma: no-cache 
 transfer-encoding: chunked 
 vary: Origin,Access-Control-Request-Method,Access-Control-Request-Headers 
 x-content-type-options: nosniff 
 x-frame-options: DENY 
 x-xss-protection: 0 
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {}
  ],
  "timestamp": "2026-05-24T04:43:56.982Z"
}
No links

GET
/api/v1/hr/leaves
Get leave requests


Retrieves leave applications and approval requests

Parameters
Cancel
Name	Description
status
string
(query)
status
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'http://localhost:5001/api/v1/hr/leaves' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzc5NTUxNDM3LCJleHAiOjE3Nzk2Mzc4Mzd9.LkGvp__0SX_qLkR1Y5UBgkdVBvp_MGfWfVvjWywzsyG4PeWS94s8gIlJtYSD0eO2'
Request URL
http://localhost:5001/api/v1/hr/leaves
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "Leave requests found",
  "error": null,
  "data": [],
  "timestamp": "2026-05-24T10:13:27.1866252"
}
Response headers
 cache-control: no-cache,no-store,max-age=0,must-revalidate 
 connection: keep-alive 
 content-type: application/json 
 date: Sun,24 May 2026 04:43:27 GMT 
 expires: 0 
 keep-alive: timeout=60 
 pragma: no-cache 
 transfer-encoding: chunked 
 vary: Origin,Access-Control-Request-Method,Access-Control-Request-Headers 
 x-content-type-options: nosniff 
 x-frame-options: DENY 
 x-xss-protection: 0 
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {}
  ],
  "timestamp": "2026-05-24T04:43:56.985Z"
}
No links

GET
/api/v1/hr/payroll
Get staff payroll


Retrieves payslips and payroll history by month and year

Parameters
Cancel
Name	Description
month
integer($int32)
(query)
month
year
integer($int32)
(query)
year
Execute
Clear
Responses
Curl

curl -X 'GET' \
  'http://localhost:5001/api/v1/hr/payroll' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzc5NTUxNDM3LCJleHAiOjE3Nzk2Mzc4Mzd9.LkGvp__0SX_qLkR1Y5UBgkdVBvp_MGfWfVvjWywzsyG4PeWS94s8gIlJtYSD0eO2'
Request URL
http://localhost:5001/api/v1/hr/payroll
Server response
Code	Details
200	
Response body
Download
{
  "success": true,
  "message": "Payroll data found",
  "error": null,
  "data": {
    "payslips": [],
    "history": []
  },
  "timestamp": "2026-05-24T10:13:45.1148322"
}
Response headers
 cache-control: no-cache,no-store,max-age=0,must-revalidate 
 connection: keep-alive 
 content-type: application/json 
 date: Sun,24 May 2026 04:43:45 GMT 
 expires: 0 
 keep-alive: timeout=60 
 pragma: no-cache 
 transfer-encoding: chunked 
 vary: Origin,Access-Control-Request-Method,Access-Control-Request-Headers 
 x-content-type-options: nosniff 
 x-frame-options: DENY 
 x-xss-protection: 0 
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "additionalProp1": {},
    "additionalProp2": {},
    "additionalProp3": {}
  },
  "timestamp": "2026-05-24T04:43:56.988Z"
}

=> please integrate the api in this page http://localhost:8080/assets  these api Assets - Assignments


GET
/api/v1/assets/assignments
List Assets - Assignments


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {},
  "timestamp": "2026-05-24T04:58:20.483Z"
}
No links

POST
/api/v1/assets/assignments
Create Assets - Assignments


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "id": 9007199254740991,
  "hospitalId": 9007199254740991,
  "branchId": 9007199254740991,
  "createdAt": "2026-05-24T04:58:20.492Z",
  "createdBy": "string",
  "updatedAt": "2026-05-24T04:58:20.492Z",
  "updatedBy": "string",
  "deleted": true,
  "asset": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.492Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.492Z",
    "updatedBy": "string",
    "deleted": true,
    "category": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.492Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.492Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "status": "string"
    },
    "subCategory": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.492Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.492Z",
      "updatedBy": "string",
      "deleted": true,
      "category": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.492Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.492Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "status": "string"
      },
      "name": "string",
      "code": "string",
      "description": "string",
      "status": "string"
    },
    "department": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.492Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.492Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "active": true,
      "headOfDepartment": "string",
      "location": "string",
      "contactNumber": "string",
      "email": "string",
      "totalBeds": 1073741824,
      "availableBeds": 1073741824
    },
    "name": "string",
    "assetCode": "string",
    "serialNumber": "string",
    "modelNumber": "string",
    "manufacturer": "string",
    "purchaseDate": "2026-05-24",
    "purchaseCost": 0.1,
    "warrantyExpiry": "2026-05-24",
    "status": "string",
    "description": "string"
  },
  "assignedTo": {
    "id": 9007199254740991,
    "username": "string",
    "password": "string",
    "email": "string",
    "phoneNumber": "string",
    "fullName": "string",
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "roles": [
      {
        "id": 9007199254740991,
        "name": "string",
        "permissions": [
          {
            "id": 9007199254740991,
            "name": "string",
            "description": "string"
          }
        ],
        "hospitalId": 9007199254740991,
        "active": true
      }
    ],
    "active": true
  },
  "location": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.492Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.492Z",
    "updatedBy": "string",
    "deleted": true,
    "name": "string",
    "building": "string",
    "floor": "string",
    "roomNumber": "string",
    "status": "string"
  },
  "assignedDate": "2026-05-24T04:58:20.492Z",
  "returnDate": "2026-05-24T04:58:20.492Z",
  "status": "string",
  "notes": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.507Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.507Z",
    "updatedBy": "string",
    "deleted": true,
    "asset": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.507Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.507Z",
      "updatedBy": "string",
      "deleted": true,
      "category": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.507Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.507Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "status": "string"
      },
      "subCategory": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.507Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.507Z",
        "updatedBy": "string",
        "deleted": true,
        "category": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-24T04:58:20.507Z",
          "createdBy": "string",
          "updatedAt": "2026-05-24T04:58:20.507Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "status": "string"
        },
        "name": "string",
        "code": "string",
        "description": "string",
        "status": "string"
      },
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.507Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.507Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true,
        "headOfDepartment": "string",
        "location": "string",
        "contactNumber": "string",
        "email": "string",
        "totalBeds": 1073741824,
        "availableBeds": 1073741824
      },
      "name": "string",
      "assetCode": "string",
      "serialNumber": "string",
      "modelNumber": "string",
      "manufacturer": "string",
      "purchaseDate": "2026-05-24",
      "purchaseCost": 0.1,
      "warrantyExpiry": "2026-05-24",
      "status": "string",
      "description": "string"
    },
    "assignedTo": {
      "id": 9007199254740991,
      "username": "string",
      "password": "string",
      "email": "string",
      "phoneNumber": "string",
      "fullName": "string",
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "roles": [
        {
          "id": 9007199254740991,
          "name": "string",
          "permissions": [
            {
              "id": 9007199254740991,
              "name": "string",
              "description": "string"
            }
          ],
          "hospitalId": 9007199254740991,
          "active": true
        }
      ],
      "active": true
    },
    "location": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.507Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.507Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "building": "string",
      "floor": "string",
      "roomNumber": "string",
      "status": "string"
    },
    "assignedDate": "2026-05-24T04:58:20.507Z",
    "returnDate": "2026-05-24T04:58:20.507Z",
    "status": "string",
    "notes": "string"
  },
  "timestamp": "2026-05-24T04:58:20.507Z"
}
No links
Assets - Audits


GET
/api/v1/assets/audits
List Assets - Audits


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {},
  "timestamp": "2026-05-24T04:58:20.519Z"
}
No links
Assets - Categories


GET
/api/v1/assets/categories
List Assets - Categories


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.521Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.521Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "status": "string"
    }
  ],
  "timestamp": "2026-05-24T04:58:20.521Z"
}
No links

POST
/api/v1/assets/categories
Create Assets - Categories


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "id": 9007199254740991,
  "hospitalId": 9007199254740991,
  "branchId": 9007199254740991,
  "createdAt": "2026-05-24T04:58:20.525Z",
  "createdBy": "string",
  "updatedAt": "2026-05-24T04:58:20.525Z",
  "updatedBy": "string",
  "deleted": true,
  "name": "string",
  "code": "string",
  "description": "string",
  "status": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.526Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.526Z",
    "updatedBy": "string",
    "deleted": true,
    "name": "string",
    "code": "string",
    "description": "string",
    "status": "string"
  },
  "timestamp": "2026-05-24T04:58:20.526Z"
}
No links
Assets - Documents


GET
/api/v1/assets/documents
List Assets - Documents


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {},
  "timestamp": "2026-05-24T04:58:20.529Z"
}
No links
Assets - Locations


GET
/api/v1/assets/locations
List Assets - Locations


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.530Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.530Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "building": "string",
      "floor": "string",
      "roomNumber": "string",
      "status": "string"
    }
  ],
  "timestamp": "2026-05-24T04:58:20.530Z"
}
No links

POST
/api/v1/assets/locations
Create Assets - Locations


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "id": 9007199254740991,
  "hospitalId": 9007199254740991,
  "branchId": 9007199254740991,
  "createdAt": "2026-05-24T04:58:20.532Z",
  "createdBy": "string",
  "updatedAt": "2026-05-24T04:58:20.532Z",
  "updatedBy": "string",
  "deleted": true,
  "name": "string",
  "building": "string",
  "floor": "string",
  "roomNumber": "string",
  "status": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.533Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.533Z",
    "updatedBy": "string",
    "deleted": true,
    "name": "string",
    "building": "string",
    "floor": "string",
    "roomNumber": "string",
    "status": "string"
  },
  "timestamp": "2026-05-24T04:58:20.533Z"
}
No links
Assets - Maintenances


GET
/api/v1/assets/maintenances
List Assets - Maintenances


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {},
  "timestamp": "2026-05-24T04:58:20.534Z"
}
No links

POST
/api/v1/assets/maintenances
Create Assets - Maintenances


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "id": 9007199254740991,
  "hospitalId": 9007199254740991,
  "branchId": 9007199254740991,
  "createdAt": "2026-05-24T04:58:20.538Z",
  "createdBy": "string",
  "updatedAt": "2026-05-24T04:58:20.538Z",
  "updatedBy": "string",
  "deleted": true,
  "asset": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.538Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.538Z",
    "updatedBy": "string",
    "deleted": true,
    "category": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.538Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.538Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "status": "string"
    },
    "subCategory": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.538Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.538Z",
      "updatedBy": "string",
      "deleted": true,
      "category": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.538Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.538Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "status": "string"
      },
      "name": "string",
      "code": "string",
      "description": "string",
      "status": "string"
    },
    "department": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.539Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.539Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "active": true,
      "headOfDepartment": "string",
      "location": "string",
      "contactNumber": "string",
      "email": "string",
      "totalBeds": 1073741824,
      "availableBeds": 1073741824
    },
    "name": "string",
    "assetCode": "string",
    "serialNumber": "string",
    "modelNumber": "string",
    "manufacturer": "string",
    "purchaseDate": "2026-05-24",
    "purchaseCost": 0.1,
    "warrantyExpiry": "2026-05-24",
    "status": "string",
    "description": "string"
  },
  "vendor": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.539Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.539Z",
    "updatedBy": "string",
    "deleted": true,
    "name": "string",
    "contactPerson": "string",
    "phone": "string",
    "email": "string",
    "address": "string",
    "tinNumber": "string",
    "status": "string"
  },
  "maintenanceType": "string",
  "maintenanceDate": "2026-05-24",
  "nextDueDate": "2026-05-24",
  "cost": 0.1,
  "status": "string",
  "findings": "string",
  "actionTaken": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.545Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.545Z",
    "updatedBy": "string",
    "deleted": true,
    "asset": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.545Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.545Z",
      "updatedBy": "string",
      "deleted": true,
      "category": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.545Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.545Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "status": "string"
      },
      "subCategory": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.545Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.545Z",
        "updatedBy": "string",
        "deleted": true,
        "category": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-24T04:58:20.545Z",
          "createdBy": "string",
          "updatedAt": "2026-05-24T04:58:20.545Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "status": "string"
        },
        "name": "string",
        "code": "string",
        "description": "string",
        "status": "string"
      },
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.545Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.545Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true,
        "headOfDepartment": "string",
        "location": "string",
        "contactNumber": "string",
        "email": "string",
        "totalBeds": 1073741824,
        "availableBeds": 1073741824
      },
      "name": "string",
      "assetCode": "string",
      "serialNumber": "string",
      "modelNumber": "string",
      "manufacturer": "string",
      "purchaseDate": "2026-05-24",
      "purchaseCost": 0.1,
      "warrantyExpiry": "2026-05-24",
      "status": "string",
      "description": "string"
    },
    "vendor": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.545Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.545Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "contactPerson": "string",
      "phone": "string",
      "email": "string",
      "address": "string",
      "tinNumber": "string",
      "status": "string"
    },
    "maintenanceType": "string",
    "maintenanceDate": "2026-05-24",
    "nextDueDate": "2026-05-24",
    "cost": 0.1,
    "status": "string",
    "findings": "string",
    "actionTaken": "string"
  },
  "timestamp": "2026-05-24T04:58:20.546Z"
}
No links
Assets - Masters
Enterprise APIs for Asset Masters



GET
/api/v1/assets/assignments
List Assets - Assignments


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {},
  "timestamp": "2026-05-24T04:58:20.552Z"
}
No links

POST
/api/v1/assets/assignments
Create Assets - Assignments


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "id": 9007199254740991,
  "hospitalId": 9007199254740991,
  "branchId": 9007199254740991,
  "createdAt": "2026-05-24T04:58:20.557Z",
  "createdBy": "string",
  "updatedAt": "2026-05-24T04:58:20.557Z",
  "updatedBy": "string",
  "deleted": true,
  "asset": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.557Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.557Z",
    "updatedBy": "string",
    "deleted": true,
    "category": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.557Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.557Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "status": "string"
    },
    "subCategory": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.557Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.557Z",
      "updatedBy": "string",
      "deleted": true,
      "category": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.557Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.557Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "status": "string"
      },
      "name": "string",
      "code": "string",
      "description": "string",
      "status": "string"
    },
    "department": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.558Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.558Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "active": true,
      "headOfDepartment": "string",
      "location": "string",
      "contactNumber": "string",
      "email": "string",
      "totalBeds": 1073741824,
      "availableBeds": 1073741824
    },
    "name": "string",
    "assetCode": "string",
    "serialNumber": "string",
    "modelNumber": "string",
    "manufacturer": "string",
    "purchaseDate": "2026-05-24",
    "purchaseCost": 0.1,
    "warrantyExpiry": "2026-05-24",
    "status": "string",
    "description": "string"
  },
  "assignedTo": {
    "id": 9007199254740991,
    "username": "string",
    "password": "string",
    "email": "string",
    "phoneNumber": "string",
    "fullName": "string",
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "roles": [
      {
        "id": 9007199254740991,
        "name": "string",
        "permissions": [
          {
            "id": 9007199254740991,
            "name": "string",
            "description": "string"
          }
        ],
        "hospitalId": 9007199254740991,
        "active": true
      }
    ],
    "active": true
  },
  "location": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.558Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.558Z",
    "updatedBy": "string",
    "deleted": true,
    "name": "string",
    "building": "string",
    "floor": "string",
    "roomNumber": "string",
    "status": "string"
  },
  "assignedDate": "2026-05-24T04:58:20.558Z",
  "returnDate": "2026-05-24T04:58:20.558Z",
  "status": "string",
  "notes": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.566Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.566Z",
    "updatedBy": "string",
    "deleted": true,
    "asset": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.566Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.566Z",
      "updatedBy": "string",
      "deleted": true,
      "category": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.566Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.566Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "status": "string"
      },
      "subCategory": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.566Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.566Z",
        "updatedBy": "string",
        "deleted": true,
        "category": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-24T04:58:20.566Z",
          "createdBy": "string",
          "updatedAt": "2026-05-24T04:58:20.566Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "status": "string"
        },
        "name": "string",
        "code": "string",
        "description": "string",
        "status": "string"
      },
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.566Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.566Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true,
        "headOfDepartment": "string",
        "location": "string",
        "contactNumber": "string",
        "email": "string",
        "totalBeds": 1073741824,
        "availableBeds": 1073741824
      },
      "name": "string",
      "assetCode": "string",
      "serialNumber": "string",
      "modelNumber": "string",
      "manufacturer": "string",
      "purchaseDate": "2026-05-24",
      "purchaseCost": 0.1,
      "warrantyExpiry": "2026-05-24",
      "status": "string",
      "description": "string"
    },
    "assignedTo": {
      "id": 9007199254740991,
      "username": "string",
      "password": "string",
      "email": "string",
      "phoneNumber": "string",
      "fullName": "string",
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "roles": [
        {
          "id": 9007199254740991,
          "name": "string",
          "permissions": [
            {
              "id": 9007199254740991,
              "name": "string",
              "description": "string"
            }
          ],
          "hospitalId": 9007199254740991,
          "active": true
        }
      ],
      "active": true
    },
    "location": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.566Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.566Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "building": "string",
      "floor": "string",
      "roomNumber": "string",
      "status": "string"
    },
    "assignedDate": "2026-05-24T04:58:20.566Z",
    "returnDate": "2026-05-24T04:58:20.566Z",
    "status": "string",
    "notes": "string"
  },
  "timestamp": "2026-05-24T04:58:20.566Z"
}
No links

GET
/api/v1/assets/audits
List Assets - Audits


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {},
  "timestamp": "2026-05-24T04:58:20.582Z"
}
No links

GET
/api/v1/assets/categories
List Assets - Categories


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.584Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.584Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "status": "string"
    }
  ],
  "timestamp": "2026-05-24T04:58:20.585Z"
}
No links

POST
/api/v1/assets/categories
Create Assets - Categories


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "id": 9007199254740991,
  "hospitalId": 9007199254740991,
  "branchId": 9007199254740991,
  "createdAt": "2026-05-24T04:58:20.590Z",
  "createdBy": "string",
  "updatedAt": "2026-05-24T04:58:20.590Z",
  "updatedBy": "string",
  "deleted": true,
  "name": "string",
  "code": "string",
  "description": "string",
  "status": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.592Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.592Z",
    "updatedBy": "string",
    "deleted": true,
    "name": "string",
    "code": "string",
    "description": "string",
    "status": "string"
  },
  "timestamp": "2026-05-24T04:58:20.592Z"
}
No links

GET
/api/v1/assets/documents
List Assets - Documents


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {},
  "timestamp": "2026-05-24T04:58:20.595Z"
}
No links

GET
/api/v1/assets/locations
List Assets - Locations


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.597Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.597Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "building": "string",
      "floor": "string",
      "roomNumber": "string",
      "status": "string"
    }
  ],
  "timestamp": "2026-05-24T04:58:20.597Z"
}
No links

POST
/api/v1/assets/locations
Create Assets - Locations


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "id": 9007199254740991,
  "hospitalId": 9007199254740991,
  "branchId": 9007199254740991,
  "createdAt": "2026-05-24T04:58:20.599Z",
  "createdBy": "string",
  "updatedAt": "2026-05-24T04:58:20.599Z",
  "updatedBy": "string",
  "deleted": true,
  "name": "string",
  "building": "string",
  "floor": "string",
  "roomNumber": "string",
  "status": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.600Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.600Z",
    "updatedBy": "string",
    "deleted": true,
    "name": "string",
    "building": "string",
    "floor": "string",
    "roomNumber": "string",
    "status": "string"
  },
  "timestamp": "2026-05-24T04:58:20.600Z"
}
No links

GET
/api/v1/assets/maintenances
List Assets - Maintenances


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {},
  "timestamp": "2026-05-24T04:58:20.602Z"
}
No links

POST
/api/v1/assets/maintenances
Create Assets - Maintenances


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "id": 9007199254740991,
  "hospitalId": 9007199254740991,
  "branchId": 9007199254740991,
  "createdAt": "2026-05-24T04:58:20.604Z",
  "createdBy": "string",
  "updatedAt": "2026-05-24T04:58:20.604Z",
  "updatedBy": "string",
  "deleted": true,
  "asset": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.604Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.604Z",
    "updatedBy": "string",
    "deleted": true,
    "category": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.604Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.604Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "status": "string"
    },
    "subCategory": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.604Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.604Z",
      "updatedBy": "string",
      "deleted": true,
      "category": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.604Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.604Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "status": "string"
      },
      "name": "string",
      "code": "string",
      "description": "string",
      "status": "string"
    },
    "department": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.604Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.604Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "active": true,
      "headOfDepartment": "string",
      "location": "string",
      "contactNumber": "string",
      "email": "string",
      "totalBeds": 1073741824,
      "availableBeds": 1073741824
    },
    "name": "string",
    "assetCode": "string",
    "serialNumber": "string",
    "modelNumber": "string",
    "manufacturer": "string",
    "purchaseDate": "2026-05-24",
    "purchaseCost": 0.1,
    "warrantyExpiry": "2026-05-24",
    "status": "string",
    "description": "string"
  },
  "vendor": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.604Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.604Z",
    "updatedBy": "string",
    "deleted": true,
    "name": "string",
    "contactPerson": "string",
    "phone": "string",
    "email": "string",
    "address": "string",
    "tinNumber": "string",
    "status": "string"
  },
  "maintenanceType": "string",
  "maintenanceDate": "2026-05-24",
  "nextDueDate": "2026-05-24",
  "cost": 0.1,
  "status": "string",
  "findings": "string",
  "actionTaken": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.609Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.609Z",
    "updatedBy": "string",
    "deleted": true,
    "asset": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.609Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.609Z",
      "updatedBy": "string",
      "deleted": true,
      "category": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.609Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.609Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "status": "string"
      },
      "subCategory": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.609Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.609Z",
        "updatedBy": "string",
        "deleted": true,
        "category": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-24T04:58:20.609Z",
          "createdBy": "string",
          "updatedAt": "2026-05-24T04:58:20.609Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "status": "string"
        },
        "name": "string",
        "code": "string",
        "description": "string",
        "status": "string"
      },
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.609Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.609Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true,
        "headOfDepartment": "string",
        "location": "string",
        "contactNumber": "string",
        "email": "string",
        "totalBeds": 1073741824,
        "availableBeds": 1073741824
      },
      "name": "string",
      "assetCode": "string",
      "serialNumber": "string",
      "modelNumber": "string",
      "manufacturer": "string",
      "purchaseDate": "2026-05-24",
      "purchaseCost": 0.1,
      "warrantyExpiry": "2026-05-24",
      "status": "string",
      "description": "string"
    },
    "vendor": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.609Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.609Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "contactPerson": "string",
      "phone": "string",
      "email": "string",
      "address": "string",
      "tinNumber": "string",
      "status": "string"
    },
    "maintenanceType": "string",
    "maintenanceDate": "2026-05-24",
    "nextDueDate": "2026-05-24",
    "cost": 0.1,
    "status": "string",
    "findings": "string",
    "actionTaken": "string"
  },
  "timestamp": "2026-05-24T04:58:20.609Z"
}
No links

GET
/api/v1/assets/masters
List Assets - Masters


Parameters
Try it out
Name	Description
page
integer($int32)
(query)
Default value : 1

1
limit
integer($int32)
(query)
Default value : 10

10
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "totalElements": 9007199254740991,
    "totalPages": 1073741824,
    "first": true,
    "last": true,
    "size": 1073741824,
    "content": [
      {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.615Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.615Z",
        "updatedBy": "string",
        "deleted": true,
        "category": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-24T04:58:20.615Z",
          "createdBy": "string",
          "updatedAt": "2026-05-24T04:58:20.615Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "status": "string"
        },
        "subCategory": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-24T04:58:20.615Z",
          "createdBy": "string",
          "updatedAt": "2026-05-24T04:58:20.615Z",
          "updatedBy": "string",
          "deleted": true,
          "category": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-24T04:58:20.615Z",
            "createdBy": "string",
            "updatedAt": "2026-05-24T04:58:20.615Z",
            "updatedBy": "string",
            "deleted": true,
            "name": "string",
            "code": "string",
            "description": "string",
            "status": "string"
          },
          "name": "string",
          "code": "string",
          "description": "string",
          "status": "string"
        },
        "department": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-24T04:58:20.616Z",
          "createdBy": "string",
          "updatedAt": "2026-05-24T04:58:20.616Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true,
          "headOfDepartment": "string",
          "location": "string",
          "contactNumber": "string",
          "email": "string",
          "totalBeds": 1073741824,
          "availableBeds": 1073741824
        },
        "name": "string",
        "assetCode": "string",
        "serialNumber": "string",
        "modelNumber": "string",
        "manufacturer": "string",
        "purchaseDate": "2026-05-24",
        "purchaseCost": 0.1,
        "warrantyExpiry": "2026-05-24",
        "status": "string",
        "description": "string"
      }
    ],
    "number": 1073741824,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "pageable": {
      "offset": 9007199254740991,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "pageSize": 1073741824,
      "pageNumber": 1073741824,
      "paged": true,
      "unpaged": true
    },
    "numberOfElements": 1073741824,
    "empty": true
  },
  "timestamp": "2026-05-24T04:58:20.616Z"
}
No links

POST
/api/v1/assets/masters
Create Assets - Masters


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "id": 9007199254740991,
  "hospitalId": 9007199254740991,
  "branchId": 9007199254740991,
  "createdAt": "2026-05-24T04:58:20.621Z",
  "createdBy": "string",
  "updatedAt": "2026-05-24T04:58:20.621Z",
  "updatedBy": "string",
  "deleted": true,
  "category": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.621Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.621Z",
    "updatedBy": "string",
    "deleted": true,
    "name": "string",
    "code": "string",
    "description": "string",
    "status": "string"
  },
  "subCategory": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.622Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.622Z",
    "updatedBy": "string",
    "deleted": true,
    "category": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.622Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.622Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "status": "string"
    },
    "name": "string",
    "code": "string",
    "description": "string",
    "status": "string"
  },
  "department": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.622Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.622Z",
    "updatedBy": "string",
    "deleted": true,
    "name": "string",
    "code": "string",
    "description": "string",
    "active": true,
    "headOfDepartment": "string",
    "location": "string",
    "contactNumber": "string",
    "email": "string",
    "totalBeds": 1073741824,
    "availableBeds": 1073741824
  },
  "name": "string",
  "assetCode": "string",
  "serialNumber": "string",
  "modelNumber": "string",
  "manufacturer": "string",
  "purchaseDate": "2026-05-24",
  "purchaseCost": 0.1,
  "warrantyExpiry": "2026-05-24",
  "status": "string",
  "description": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.625Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.625Z",
    "updatedBy": "string",
    "deleted": true,
    "category": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.625Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.625Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "status": "string"
    },
    "subCategory": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.625Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.625Z",
      "updatedBy": "string",
      "deleted": true,
      "category": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.625Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.625Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "status": "string"
      },
      "name": "string",
      "code": "string",
      "description": "string",
      "status": "string"
    },
    "department": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.625Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.625Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "active": true,
      "headOfDepartment": "string",
      "location": "string",
      "contactNumber": "string",
      "email": "string",
      "totalBeds": 1073741824,
      "availableBeds": 1073741824
    },
    "name": "string",
    "assetCode": "string",
    "serialNumber": "string",
    "modelNumber": "string",
    "manufacturer": "string",
    "purchaseDate": "2026-05-24",
    "purchaseCost": 0.1,
    "warrantyExpiry": "2026-05-24",
    "status": "string",
    "description": "string"
  },
  "timestamp": "2026-05-24T04:58:20.625Z"
}
No links

GET
/api/v1/assets/masters/{id}
Method Summary


Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.629Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.629Z",
    "updatedBy": "string",
    "deleted": true,
    "category": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.629Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.629Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "status": "string"
    },
    "subCategory": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.629Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.629Z",
      "updatedBy": "string",
      "deleted": true,
      "category": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.629Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.629Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "status": "string"
      },
      "name": "string",
      "code": "string",
      "description": "string",
      "status": "string"
    },
    "department": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.629Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.629Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "active": true,
      "headOfDepartment": "string",
      "location": "string",
      "contactNumber": "string",
      "email": "string",
      "totalBeds": 1073741824,
      "availableBeds": 1073741824
    },
    "name": "string",
    "assetCode": "string",
    "serialNumber": "string",
    "modelNumber": "string",
    "manufacturer": "string",
    "purchaseDate": "2026-05-24",
    "purchaseCost": 0.1,
    "warrantyExpiry": "2026-05-24",
    "status": "string",
    "description": "string"
  },
  "timestamp": "2026-05-24T04:58:20.629Z"
}
No links

PUT
/api/v1/assets/masters/{id}
Update Assets - Masters


Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
Request body

application/json
Example Value
Schema
{
  "id": 9007199254740991,
  "hospitalId": 9007199254740991,
  "branchId": 9007199254740991,
  "createdAt": "2026-05-24T04:58:20.634Z",
  "createdBy": "string",
  "updatedAt": "2026-05-24T04:58:20.634Z",
  "updatedBy": "string",
  "deleted": true,
  "category": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.634Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.634Z",
    "updatedBy": "string",
    "deleted": true,
    "name": "string",
    "code": "string",
    "description": "string",
    "status": "string"
  },
  "subCategory": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.634Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.634Z",
    "updatedBy": "string",
    "deleted": true,
    "category": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.634Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.635Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "status": "string"
    },
    "name": "string",
    "code": "string",
    "description": "string",
    "status": "string"
  },
  "department": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.635Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.635Z",
    "updatedBy": "string",
    "deleted": true,
    "name": "string",
    "code": "string",
    "description": "string",
    "active": true,
    "headOfDepartment": "string",
    "location": "string",
    "contactNumber": "string",
    "email": "string",
    "totalBeds": 1073741824,
    "availableBeds": 1073741824
  },
  "name": "string",
  "assetCode": "string",
  "serialNumber": "string",
  "modelNumber": "string",
  "manufacturer": "string",
  "purchaseDate": "2026-05-24",
  "purchaseCost": 0.1,
  "warrantyExpiry": "2026-05-24",
  "status": "string",
  "description": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.638Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.638Z",
    "updatedBy": "string",
    "deleted": true,
    "category": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.638Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.638Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "status": "string"
    },
    "subCategory": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.638Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.638Z",
      "updatedBy": "string",
      "deleted": true,
      "category": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-24T04:58:20.638Z",
        "createdBy": "string",
        "updatedAt": "2026-05-24T04:58:20.638Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "status": "string"
      },
      "name": "string",
      "code": "string",
      "description": "string",
      "status": "string"
    },
    "department": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.638Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.638Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "active": true,
      "headOfDepartment": "string",
      "location": "string",
      "contactNumber": "string",
      "email": "string",
      "totalBeds": 1073741824,
      "availableBeds": 1073741824
    },
    "name": "string",
    "assetCode": "string",
    "serialNumber": "string",
    "modelNumber": "string",
    "manufacturer": "string",
    "purchaseDate": "2026-05-24",
    "purchaseCost": 0.1,
    "warrantyExpiry": "2026-05-24",
    "status": "string",
    "description": "string"
  },
  "timestamp": "2026-05-24T04:58:20.638Z"
}
No links

DELETE
/api/v1/assets/masters/{id}
Method Summary


Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {},
  "timestamp": "2026-05-24T04:58:20.645Z"
}
No links

GET
/api/v1/assets/sub-categories
List Assets - Sub categories


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {},
  "timestamp": "2026-05-24T04:58:20.646Z"
}
No links

POST
/api/v1/assets/sub-categories
Create Assets - Sub categories


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {},
  "timestamp": "2026-05-24T04:58:20.647Z"
}
No links

GET
/api/v1/assets/usage-logs
List Assets - Usage logs


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {},
  "timestamp": "2026-05-24T04:58:20.648Z"
}
No links

GET
/api/v1/assets/vendors
List Assets - Vendors


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.649Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.649Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "contactPerson": "string",
      "phone": "string",
      "email": "string",
      "address": "string",
      "tinNumber": "string",
      "status": "string"
    }
  ],
  "timestamp": "2026-05-24T04:58:20.649Z"
}
No links

POST
/api/v1/assets/vendors
Create Assets - Vendors


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "id": 9007199254740991,
  "hospitalId": 9007199254740991,
  "branchId": 9007199254740991,
  "createdAt": "2026-05-24T04:58:20.652Z",
  "createdBy": "string",
  "updatedAt": "2026-05-24T04:58:20.652Z",
  "updatedBy": "string",
  "deleted": true,
  "name": "string",
  "contactPerson": "string",
  "phone": "string",
  "email": "string",
  "address": "string",
  "tinNumber": "string",
  "status": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.653Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.653Z",
    "updatedBy": "string",
    "deleted": true,
    "name": "string",
    "contactPerson": "string",
    "phone": "string",
    "email": "string",
    "address": "string",
    "tinNumber": "string",
    "status": "string"
  },
  "timestamp": "2026-05-24T04:58:20.653Z"
}
No links
Assets - Sub categories


GET
/api/v1/assets/sub-categories
List Assets - Sub categories


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {},
  "timestamp": "2026-05-24T04:58:20.655Z"
}
No links

POST
/api/v1/assets/sub-categories
Create Assets - Sub categories


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {},
  "timestamp": "2026-05-24T04:58:20.660Z"
}
No links
Assets - Usage logs


GET
/api/v1/assets/usage-logs
List Assets - Usage logs


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {},
  "timestamp": "2026-05-24T04:58:20.661Z"
}
No links
Assets - Vendors


GET
/api/v1/assets/vendors
List Assets - Vendors


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T04:58:20.662Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T04:58:20.662Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "contactPerson": "string",
      "phone": "string",
      "email": "string",
      "address": "string",
      "tinNumber": "string",
      "status": "string"
    }
  ],
  "timestamp": "2026-05-24T04:58:20.662Z"
}
No links

POST
/api/v1/assets/vendors
Create Assets - Vendors


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "id": 9007199254740991,
  "hospitalId": 9007199254740991,
  "branchId": 9007199254740991,
  "createdAt": "2026-05-24T04:58:20.665Z",
  "createdBy": "string",
  "updatedAt": "2026-05-24T04:58:20.665Z",
  "updatedBy": "string",
  "deleted": true,
  "name": "string",
  "contactPerson": "string",
  "phone": "string",
  "email": "string",
  "address": "string",
  "tinNumber": "string",
  "status": "string"
}
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T04:58:20.684Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T04:58:20.684Z",
    "updatedBy": "string",
    "deleted": true,
    "name": "string",
    "contactPerson": "string",
    "phone": "string",
    "email": "string",
    "address": "string",
    "tinNumber": "string",
    "status": "string"
  },
  "timestamp": "2026-05-24T04:58:20.684Z"
}
=> in this page http://localhost:8080/equipment please integeate this api Equipment Management
APIs for tracking biomedical equipment maintenance and breakdown tickets



GET
/api/v1/equipment/breakdown-tickets
List breakdown tickets


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {}
  ],
  "timestamp": "2026-05-24T05:01:55.291Z"
}
No links

GET
/api/v1/equipment/categories
List equipment categories


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {}
  ],
  "timestamp": "2026-05-24T05:01:55.295Z"
}
No links

GET
/api/v1/equipment/maintenance-schedules
List maintenance schedules


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {}
  ],
  "timestamp": "2026-05-24T05:01:55.297Z"
}
in thi spage http://localhost:8080/helpdesk please integrate this api  Help Desk
APIs for IT support and maintenance ticketing system



GET
/api/v1/helpdesk/dashboard
Help desk dashboard statistics


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "additionalProp1": {},
    "additionalProp2": {},
    "additionalProp3": {}
  },
  "timestamp": "2026-05-24T05:04:56.138Z"
}
No links

GET
/api/v1/helpdesk/tickets
List all tickets


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {}
  ],
  "timestamp": "2026-05-24T05:04:56.141Z"
}
in this page http://localhost:8080/parking plase integrate this api Parking Management
APIs for tracking hospital parking slot availability and vehicle entries



GET
/api/v1/parking/dashboard
Parking dashboard statistics


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "additionalProp1": {},
    "additionalProp2": {},
    "additionalProp3": {}
  },
  "timestamp": "2026-05-24T05:09:13.205Z"
}
No links

GET
/api/v1/parking/entries
List parking entries


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {}
  ],
  "timestamp": "2026-05-24T05:09:13.209Z"
}
=> inn this http://localhost:8080/reports please integrate this api Reporting Management
APIs for generating and retrieving hospital performance reports



POST
/api/reporting/generate
Generate system report


Generates a new performance or clinical report in PDF/Excel format

Parameters
Try it out
Name	Description
name *
string
(query)
name
type *
string
(query)
type
format *
string
(query)
format
generatedBy *
string
(query)
generatedBy
Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-24T05:11:23.986Z",
    "createdBy": "string",
    "updatedAt": "2026-05-24T05:11:23.986Z",
    "updatedBy": "string",
    "deleted": true,
    "reportName": "string",
    "reportType": "string",
    "reportFormat": "string",
    "generatedAt": "2026-05-24T05:11:23.986Z",
    "generatedBy": "string",
    "reportUrl": "string",
    "reportParameters": "string",
    "status": "string"
  },
  "timestamp": "2026-05-24T05:11:23.986Z"
}
No links

GET
/api/reporting/list
Method Summary


Retrieves a list of all reports generated for the current hospital

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-24T05:11:23.989Z",
      "createdBy": "string",
      "updatedAt": "2026-05-24T05:11:23.989Z",
      "updatedBy": "string",
      "deleted": true,
      "reportName": "string",
      "reportType": "string",
      "reportFormat": "string",
      "generatedAt": "2026-05-24T05:11:23.989Z",
      "generatedBy": "string",
      "reportUrl": "string",
      "reportParameters": "string",
      "status": "string"
    }
  ],
  "timestamp": "2026-05-24T05:11:23.989Z"
}
=> in the http://localhost:8080/certificates integrate this api Certificate Management
APIs for managing medical certificates, templates, and digital signatures



GET
/api/v1/certificates/generated
List generated certificates


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {}
  ],
  "timestamp": "2026-05-24T05:16:43.162Z"
}
No links

GET
/api/v1/certificates/signatures
List digital signatures


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {}
  ],
  "timestamp": "2026-05-24T05:16:43.163Z"
}
No links

GET
/api/v1/certificates/templates
List certificate templates


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {}
  ],
  "timestamp": "2026-05-24T05:16:43.165Z"
}
No links

GET
/api/v1/certificates/types
List certificate types


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {}
  ],
  "timestamp": "2026-05-24T05:16:43.167Z"
}
No links

GET
/api/v1/certificates/verifications
List certificate verifications


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
OK

Media type

*/*
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Operation completed successfully",
  "error": null,
  "data": [
    {}
  ],
  "timestamp": "2026-05-24T05:16:43.168Z"
}