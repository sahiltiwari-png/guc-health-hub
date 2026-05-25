Bed Management
Comprehensive Bed Management APIs including assignment, transfer, and lifecycle



POST
/api/v1/bed-management/assign
Assign a bed to a patient (Admit)


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "patientId": 1,
  "doctorId": 1,
  "bedId": 2,
  "departmentId": 1,
  "caseType": "NORMAL",
  "triage": "GREEN",
  "guardianName": "ipd testing",
  "guardianPhone": "+1234567890",
  "guardianRelation": "Father",
  "insuranceProvider": "HealthFirst Insurance",
  "policyNumber": "POL12345",
  "diagnosis": "General weakness",
  "admissionReason": "Routine checkup and observation",
  "advanceAmount": 5000
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
    "createdAt": "2026-05-25T08:07:43.211Z",
    "createdBy": "string",
    "updatedAt": "2026-05-25T08:07:43.211Z",
    "updatedBy": "string",
    "deleted": true,
    "patient": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-25T08:07:43.211Z",
      "createdBy": "string",
      "updatedAt": "2026-05-25T08:07:43.211Z",
      "updatedBy": "string",
      "deleted": true,
      "firstName": "string",
      "lastName": "string",
      "gender": "string",
      "dateOfBirth": "2026-05-25",
      "phoneNumber": "string",
      "email": "string",
      "address": "string",
      "uhid": "string",
      "maritalStatus": "string",
      "bloodGroup": "string",
      "guardianName": "string",
      "guardianPhone": "string",
      "emergencyContactName": "string",
      "emergencyContactPhone": "string",
      "occupation": "string",
      "religion": "string",
      "nationality": "string",
      "patientImage": "string",
      "familyHead": "string",
      "relationshipWithHead": "string",
      "active": true,
      "fullName": "string"
    },
    "admittingDoctor": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-25T08:07:43.211Z",
      "createdBy": "string",
      "updatedAt": "2026-05-25T08:07:43.211Z",
      "updatedBy": "string",
      "deleted": true,
      "user": {
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
      "specialization": "string",
      "qualification": "string",
      "experience": "string",
      "registrationNumber": "string",
      "consultationFee": 0.1,
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-25T08:07:43.211Z",
        "createdBy": "string",
        "updatedAt": "2026-05-25T08:07:43.211Z",
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
      "available": true,
      "biography": "string",
      "profileImage": "string",
      "signatureImage": "string",
      "branches": [
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
      ]
    },
    "primaryDoctor": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-25T08:07:43.211Z",
      "createdBy": "string",
      "updatedAt": "2026-05-25T08:07:43.211Z",
      "updatedBy": "string",
      "deleted": true,
      "user": {
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
      "specialization": "string",
      "qualification": "string",
      "experience": "string",
      "registrationNumber": "string",
      "consultationFee": 0.1,
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-25T08:07:43.211Z",
        "createdBy": "string",
        "updatedAt": "2026-05-25T08:07:43.211Z",
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
      "available": true,
      "biography": "string",
      "profileImage": "string",
      "signatureImage": "string",
      "branches": [
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
      ]
    },
    "department": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-25T08:07:43.211Z",
      "createdBy": "string",
      "updatedAt": "2026-05-25T08:07:43.211Z",
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
    "bed": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-25T08:07:43.211Z",
      "createdBy": "string",
      "updatedAt": "2026-05-25T08:07:43.211Z",
      "updatedBy": "string",
      "deleted": true,
      "ward": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-25T08:07:43.211Z",
        "createdBy": "string",
        "updatedAt": "2026-05-25T08:07:43.211Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "type": "ICU",
        "department": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-25T08:07:43.211Z",
          "createdBy": "string",
          "updatedAt": "2026-05-25T08:07:43.211Z",
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
        "capacity": 1073741824,
        "active": true,
        "beds": [
          "string"
        ]
      },
      "bedNumber": "string",
      "status": "AVAILABLE",
      "bedChargePerDay": 0.1
    },
    "ipdNumber": "string",
    "admissionDate": "2026-05-25T08:07:43.211Z",
    "dischargeDate": "2026-05-25T08:07:43.211Z",
    "status": "ADMITTED",
    "caseType": "string",
    "triage": "string",
    "guardianName": "string",
    "guardianPhone": "string",
    "guardianRelation": "string",
    "policyNumber": "string",
    "insuranceProvider": "string",
    "diagnosis": "string",
    "admissionReason": "string",
    "advanceAmount": 0.1
  },
  "timestamp": "2026-05-25T08:07:43.211Z"
}
No links

GET
/api/v1/bed-management/beds
Search and filter beds


Filter beds by ward, department, status, and search term

Parameters
Try it out
Name	Description
wardId
integer($int64)
(query)
wardId
departmentId
integer($int64)
(query)
departmentId
status
string
(query)
Available values : AVAILABLE, OCCUPIED, RESERVED, CLEANING, UNDER_MAINTENANCE


--
search
string
(query)
search
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
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-25T08:07:43.223Z",
        "createdBy": "string",
        "updatedAt": "2026-05-25T08:07:43.223Z",
        "updatedBy": "string",
        "deleted": true,
        "ward": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-25T08:07:43.223Z",
          "createdBy": "string",
          "updatedAt": "2026-05-25T08:07:43.223Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "type": "ICU",
          "department": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-25T08:07:43.223Z",
            "createdBy": "string",
            "updatedAt": "2026-05-25T08:07:43.223Z",
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
          "capacity": 1073741824,
          "active": true,
          "beds": [
            "string"
          ]
        },
        "bedNumber": "string",
        "status": "AVAILABLE",
        "bedChargePerDay": 0.1
      }
    ],
    "number": 1073741824,
    "sort": {
      "empty": true,
      "sorted": true,
      "unsorted": true
    },
    "numberOfElements": 1073741824,
    "pageable": {
      "offset": 9007199254740991,
      "sort": {
        "empty": true,
        "sorted": true,
        "unsorted": true
      },
      "paged": true,
      "pageNumber": 1073741824,
      "pageSize": 1073741824,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2026-05-25T08:07:43.223Z"
}
No links

POST
/api/v1/bed-management/beds
Create a new bed


Parameters
Try it out
Name	Description
wardId *
integer($int64)
(query)
wardId
Request body

application/json
Example Value
Schema
{
  "id": 9007199254740991,
  "hospitalId": 9007199254740991,
  "branchId": 9007199254740991,
  "createdAt": "2026-05-25T08:07:43.227Z",
  "createdBy": "string",
  "updatedAt": "2026-05-25T08:07:43.227Z",
  "updatedBy": "string",
  "deleted": true,
  "ward": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-25T08:07:43.227Z",
    "createdBy": "string",
    "updatedAt": "2026-05-25T08:07:43.227Z",
    "updatedBy": "string",
    "deleted": true,
    "name": "string",
    "type": "ICU",
    "department": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-25T08:07:43.227Z",
      "createdBy": "string",
      "updatedAt": "2026-05-25T08:07:43.227Z",
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
    "capacity": 1073741824,
    "active": true,
    "beds": [
      "string"
    ]
  },
  "bedNumber": "string",
  "status": "AVAILABLE",
  "bedChargePerDay": 0.1
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
    "createdAt": "2026-05-25T08:07:43.228Z",
    "createdBy": "string",
    "updatedAt": "2026-05-25T08:07:43.228Z",
    "updatedBy": "string",
    "deleted": true,
    "ward": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-25T08:07:43.228Z",
      "createdBy": "string",
      "updatedAt": "2026-05-25T08:07:43.228Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "type": "ICU",
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-25T08:07:43.228Z",
        "createdBy": "string",
        "updatedAt": "2026-05-25T08:07:43.228Z",
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
      "capacity": 1073741824,
      "active": true,
      "beds": [
        "string"
      ]
    },
    "bedNumber": "string",
    "status": "AVAILABLE",
    "bedChargePerDay": 0.1
  },
  "timestamp": "2026-05-25T08:07:43.228Z"
}
No links

GET
/api/v1/bed-management/beds/{id}
Get bed details by ID


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
    "createdAt": "2026-05-25T08:07:43.231Z",
    "createdBy": "string",
    "updatedAt": "2026-05-25T08:07:43.231Z",
    "updatedBy": "string",
    "deleted": true,
    "ward": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-25T08:07:43.231Z",
      "createdBy": "string",
      "updatedAt": "2026-05-25T08:07:43.231Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "type": "ICU",
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-25T08:07:43.231Z",
        "createdBy": "string",
        "updatedAt": "2026-05-25T08:07:43.231Z",
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
      "capacity": 1073741824,
      "active": true,
      "beds": [
        "string"
      ]
    },
    "bedNumber": "string",
    "status": "AVAILABLE",
    "bedChargePerDay": 0.1
  },
  "timestamp": "2026-05-25T08:07:43.231Z"
}
No links

PUT
/api/v1/bed-management/beds/{id}
Update bed details


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
  "createdAt": "2026-05-25T08:07:43.233Z",
  "createdBy": "string",
  "updatedAt": "2026-05-25T08:07:43.233Z",
  "updatedBy": "string",
  "deleted": true,
  "ward": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-25T08:07:43.233Z",
    "createdBy": "string",
    "updatedAt": "2026-05-25T08:07:43.233Z",
    "updatedBy": "string",
    "deleted": true,
    "name": "string",
    "type": "ICU",
    "department": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-25T08:07:43.233Z",
      "createdBy": "string",
      "updatedAt": "2026-05-25T08:07:43.233Z",
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
    "capacity": 1073741824,
    "active": true,
    "beds": [
      "string"
    ]
  },
  "bedNumber": "string",
  "status": "AVAILABLE",
  "bedChargePerDay": 0.1
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
    "createdAt": "2026-05-25T08:07:43.235Z",
    "createdBy": "string",
    "updatedAt": "2026-05-25T08:07:43.235Z",
    "updatedBy": "string",
    "deleted": true,
    "ward": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-25T08:07:43.235Z",
      "createdBy": "string",
      "updatedAt": "2026-05-25T08:07:43.235Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "type": "ICU",
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-25T08:07:43.235Z",
        "createdBy": "string",
        "updatedAt": "2026-05-25T08:07:43.235Z",
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
      "capacity": 1073741824,
      "active": true,
      "beds": [
        "string"
      ]
    },
    "bedNumber": "string",
    "status": "AVAILABLE",
    "bedChargePerDay": 0.1
  },
  "timestamp": "2026-05-25T08:07:43.235Z"
}
No links

DELETE
/api/v1/bed-management/beds/{id}
Delete a bed


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
  "timestamp": "2026-05-25T08:07:43.237Z"
}
No links

GET
/api/v1/bed-management/beds/available
Get available beds by ward


Parameters
Try it out
Name	Description
wardId *
integer($int64)
(query)
wardId
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
      "createdAt": "2026-05-25T08:07:43.238Z",
      "createdBy": "string",
      "updatedAt": "2026-05-25T08:07:43.238Z",
      "updatedBy": "string",
      "deleted": true,
      "ward": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-25T08:07:43.238Z",
        "createdBy": "string",
        "updatedAt": "2026-05-25T08:07:43.238Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "type": "ICU",
        "department": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-25T08:07:43.238Z",
          "createdBy": "string",
          "updatedAt": "2026-05-25T08:07:43.238Z",
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
        "capacity": 1073741824,
        "active": true,
        "beds": [
          "string"
        ]
      },
      "bedNumber": "string",
      "status": "AVAILABLE",
      "bedChargePerDay": 0.1
    }
  ],
  "timestamp": "2026-05-25T08:07:43.238Z"
}
No links

GET
/api/v1/bed-management/lifecycle/{bedId}
Get bed assignment history


Parameters
Try it out
Name	Description
bedId *
integer($int64)
(path)
bedId
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
      "createdAt": "2026-05-25T08:07:43.241Z",
      "createdBy": "string",
      "updatedAt": "2026-05-25T08:07:43.241Z",
      "updatedBy": "string",
      "deleted": true,
      "patient": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-25T08:07:43.241Z",
        "createdBy": "string",
        "updatedAt": "2026-05-25T08:07:43.241Z",
        "updatedBy": "string",
        "deleted": true,
        "firstName": "string",
        "lastName": "string",
        "gender": "string",
        "dateOfBirth": "2026-05-25",
        "phoneNumber": "string",
        "email": "string",
        "address": "string",
        "uhid": "string",
        "maritalStatus": "string",
        "bloodGroup": "string",
        "guardianName": "string",
        "guardianPhone": "string",
        "emergencyContactName": "string",
        "emergencyContactPhone": "string",
        "occupation": "string",
        "religion": "string",
        "nationality": "string",
        "patientImage": "string",
        "familyHead": "string",
        "relationshipWithHead": "string",
        "active": true,
        "fullName": "string"
      },
      "admittingDoctor": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-25T08:07:43.241Z",
        "createdBy": "string",
        "updatedAt": "2026-05-25T08:07:43.241Z",
        "updatedBy": "string",
        "deleted": true,
        "user": {
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
        "specialization": "string",
        "qualification": "string",
        "experience": "string",
        "registrationNumber": "string",
        "consultationFee": 0.1,
        "department": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-25T08:07:43.241Z",
          "createdBy": "string",
          "updatedAt": "2026-05-25T08:07:43.241Z",
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
        "available": true,
        "biography": "string",
        "profileImage": "string",
        "signatureImage": "string",
        "branches": [
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
        ]
      },
      "primaryDoctor": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-25T08:07:43.241Z",
        "createdBy": "string",
        "updatedAt": "2026-05-25T08:07:43.241Z",
        "updatedBy": "string",
        "deleted": true,
        "user": {
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
        "specialization": "string",
        "qualification": "string",
        "experience": "string",
        "registrationNumber": "string",
        "consultationFee": 0.1,
        "department": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-25T08:07:43.241Z",
          "createdBy": "string",
          "updatedAt": "2026-05-25T08:07:43.241Z",
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
        "available": true,
        "biography": "string",
        "profileImage": "string",
        "signatureImage": "string",
        "branches": [
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
        ]
      },
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-25T08:07:43.241Z",
        "createdBy": "string",
        "updatedAt": "2026-05-25T08:07:43.241Z",
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
      "bed": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-25T08:07:43.241Z",
        "createdBy": "string",
        "updatedAt": "2026-05-25T08:07:43.241Z",
        "updatedBy": "string",
        "deleted": true,
        "ward": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-25T08:07:43.241Z",
          "createdBy": "string",
          "updatedAt": "2026-05-25T08:07:43.241Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "type": "ICU",
          "department": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-25T08:07:43.241Z",
            "createdBy": "string",
            "updatedAt": "2026-05-25T08:07:43.241Z",
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
          "capacity": 1073741824,
          "active": true,
          "beds": [
            "string"
          ]
        },
        "bedNumber": "string",
        "status": "AVAILABLE",
        "bedChargePerDay": 0.1
      },
      "ipdNumber": "string",
      "admissionDate": "2026-05-25T08:07:43.241Z",
      "dischargeDate": "2026-05-25T08:07:43.241Z",
      "status": "ADMITTED",
      "caseType": "string",
      "triage": "string",
      "guardianName": "string",
      "guardianPhone": "string",
      "guardianRelation": "string",
      "policyNumber": "string",
      "insuranceProvider": "string",
      "diagnosis": "string",
      "admissionReason": "string",
      "advanceAmount": 0.1
    }
  ],
  "timestamp": "2026-05-25T08:07:43.241Z"
}
No links

POST
/api/v1/bed-management/release/{bedId}
Release/Clear a bed manually


Parameters
Try it out
Name	Description
bedId *
integer($int64)
(path)
bedId
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
  "timestamp": "2026-05-25T08:07:43.249Z"
}
No links

POST
/api/v1/bed-management/transfer
Transfer patient to another bed


Parameters
Try it out
Name	Description
admissionId *
integer($int64)
(query)
admissionId
newBedId *
integer($int64)
(query)
newBedId
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
    "createdAt": "2026-05-25T08:07:43.251Z",
    "createdBy": "string",
    "updatedAt": "2026-05-25T08:07:43.251Z",
    "updatedBy": "string",
    "deleted": true,
    "patient": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-25T08:07:43.251Z",
      "createdBy": "string",
      "updatedAt": "2026-05-25T08:07:43.251Z",
      "updatedBy": "string",
      "deleted": true,
      "firstName": "string",
      "lastName": "string",
      "gender": "string",
      "dateOfBirth": "2026-05-25",
      "phoneNumber": "string",
      "email": "string",
      "address": "string",
      "uhid": "string",
      "maritalStatus": "string",
      "bloodGroup": "string",
      "guardianName": "string",
      "guardianPhone": "string",
      "emergencyContactName": "string",
      "emergencyContactPhone": "string",
      "occupation": "string",
      "religion": "string",
      "nationality": "string",
      "patientImage": "string",
      "familyHead": "string",
      "relationshipWithHead": "string",
      "active": true,