V1 - labRoute


GET
/api/v1/diagnostics/lab
List V1 - labRoute


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
        "createdAt": "2026-05-22T05:15:20.390Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T05:15:20.390Z",
        "updatedBy": "string",
        "deleted": true,
        "patient": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-22T05:15:20.390Z",
          "createdBy": "string",
          "updatedAt": "2026-05-22T05:15:20.390Z",
          "updatedBy": "string",
          "deleted": true,
          "firstName": "string",
          "lastName": "string",
          "gender": "string",
          "dateOfBirth": "2026-05-22",
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
        "orderingDoctor": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-22T05:15:20.390Z",
          "createdBy": "string",
          "updatedAt": "2026-05-22T05:15:20.390Z",
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
            "createdAt": "2026-05-22T05:15:20.390Z",
            "createdBy": "string",
            "updatedAt": "2026-05-22T05:15:20.390Z",
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
          "createdAt": "2026-05-22T05:15:20.390Z",
          "createdBy": "string",
          "updatedAt": "2026-05-22T05:15:20.390Z",
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
        "orderNumber": "string",
        "testName": "string",
        "testCode": "string",
        "sampleType": "string",
        "orderTime": "2026-05-22T05:15:20.390Z",
        "sampleCollectionTime": "2026-05-22T05:15:20.390Z",
        "resultTime": "2026-05-22T05:15:20.390Z",
        "status": "ORDERED",
        "result": "string",
        "remarks": "string"
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
      "pageNumber": 1073741824,
      "pageSize": 1073741824,
      "paged": true,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2026-05-22T05:15:20.390Z"
}
No links

POST
/api/v1/diagnostics/lab
Create V1 - labRoute


Parameters
Try it out
Name	Description
patientId *
integer($int64)
(query)
patientId
doctorId *
integer($int64)
(query)
doctorId
departmentId
integer($int64)
(query)
departmentId
Request body

application/json
Example Value
Schema
{
  "id": 9007199254740991,
  "hospitalId": 9007199254740991,
  "branchId": 9007199254740991,
  "createdAt": "2026-05-22T05:15:20.415Z",
  "createdBy": "string",
  "updatedAt": "2026-05-22T05:15:20.415Z",
  "updatedBy": "string",
  "deleted": true,
  "patient": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-22T05:15:20.415Z",
    "createdBy": "string",
    "updatedAt": "2026-05-22T05:15:20.415Z",
    "updatedBy": "string",
    "deleted": true,
    "firstName": "string",
    "lastName": "string",
    "gender": "string",
    "dateOfBirth": "2026-05-22",
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
  "orderingDoctor": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-22T05:15:20.415Z",
    "createdBy": "string",
    "updatedAt": "2026-05-22T05:15:20.415Z",
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
      "createdAt": "2026-05-22T05:15:20.415Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T05:15:20.415Z",
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
    "createdAt": "2026-05-22T05:15:20.416Z",
    "createdBy": "string",
    "updatedAt": "2026-05-22T05:15:20.416Z",
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
  "orderNumber": "string",
  "testName": "string",
  "testCode": "string",
  "sampleType": "string",
  "orderTime": "2026-05-22T05:15:20.416Z",
  "sampleCollectionTime": "2026-05-22T05:15:20.416Z",
  "resultTime": "2026-05-22T05:15:20.416Z",
  "status": "ORDERED",
  "result": "string",
  "remarks": "string"
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
    "createdAt": "2026-05-22T05:15:20.425Z",
    "createdBy": "string",
    "updatedAt": "2026-05-22T05:15:20.425Z",
    "updatedBy": "string",
    "deleted": true,
    "patient": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-22T05:15:20.425Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T05:15:20.425Z",
      "updatedBy": "string",
      "deleted": true,
      "firstName": "string",
      "lastName": "string",
      "gender": "string",
      "dateOfBirth": "2026-05-22",
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
    "orderingDoctor": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-22T05:15:20.425Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T05:15:20.425Z",
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
        "createdAt": "2026-05-22T05:15:20.426Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T05:15:20.426Z",
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
      "createdAt": "2026-05-22T05:15:20.426Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T05:15:20.426Z",
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
    "orderNumber": "string",
    "testName": "string",
    "testCode": "string",
    "sampleType": "string",
    "orderTime": "2026-05-22T05:15:20.426Z",
    "sampleCollectionTime": "2026-05-22T05:15:20.426Z",
    "resultTime": "2026-05-22T05:15:20.426Z",
    "status": "ORDERED",
    "result": "string",
    "remarks": "string"
  },
  "timestamp": "2026-05-22T05:15:20.426Z"
}
No links

GET
/api/v1/diagnostics/lab/{id}
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
    "createdAt": "2026-05-22T05:15:20.439Z",
    "createdBy": "string",
    "updatedAt": "2026-05-22T05:15:20.439Z",
    "updatedBy": "string",
    "deleted": true,
    "patient": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-22T05:15:20.439Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T05:15:20.439Z",
      "updatedBy": "string",
      "deleted": true,
      "firstName": "string",
      "lastName": "string",
      "gender": "string",
      "dateOfBirth": "2026-05-22",
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
    "orderingDoctor": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-22T05:15:20.439Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T05:15:20.439Z",
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
        "createdAt": "2026-05-22T05:15:20.439Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T05:15:20.439Z",
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
      "createdAt": "2026-05-22T05:15:20.440Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T05:15:20.440Z",
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
    "orderNumber": "string",
    "testName": "string",
    "testCode": "string",
    "sampleType": "string",
    "orderTime": "2026-05-22T05:15:20.440Z",
    "sampleCollectionTime": "2026-05-22T05:15:20.440Z",
    "resultTime": "2026-05-22T05:15:20.440Z",
    "status": "ORDERED",
    "result": "string",
    "remarks": "string"
  },
  "timestamp": "2026-05-22T05:15:20.440Z"
}
No links

PUT
/api/v1/diagnostics/lab/{id}
Update V1 - labRoute


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
  "createdAt": "2026-05-22T05:15:20.455Z",
  "createdBy": "string",
  "updatedAt": "2026-05-22T05:15:20.455Z",
  "updatedBy": "string",
  "deleted": true,
  "patient": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-22T05:15:20.455Z",
    "createdBy": "string",
    "updatedAt": "2026-05-22T05:15:20.455Z",
    "updatedBy": "string",
    "deleted": true,
    "firstName": "string",
    "lastName": "string",
    "gender": "string",
    "dateOfBirth": "2026-05-22",
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
  "orderingDoctor": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-22T05:15:20.455Z",
    "createdBy": "string",
    "updatedAt": "2026-05-22T05:15:20.455Z",
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
      "createdAt": "2026-05-22T05:15:20.455Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T05:15:20.455Z",
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
    "createdAt": "2026-05-22T05:15:20.455Z",
    "createdBy": "string",
    "updatedAt": "2026-05-22T05:15:20.455Z",
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
  "orderNumber": "string",
  "testName": "string",
  "testCode": "string",
  "sampleType": "string",
  "orderTime": "2026-05-22T05:15:20.455Z",
  "sampleCollectionTime": "2026-05-22T05:15:20.455Z",
  "resultTime": "2026-05-22T05:15:20.455Z",
  "status": "ORDERED",
  "result": "string",
  "remarks": "string"
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
    "createdAt": "2026-05-22T05:15:20.465Z",
    "createdBy": "string",
    "updatedAt": "2026-05-22T05:15:20.465Z",
    "updatedBy": "string",
    "deleted": true,
    "patient": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-22T05:15:20.465Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T05:15:20.465Z",
      "updatedBy": "string",
      "deleted": true,
      "firstName": "string",
      "lastName": "string",
      "gender": "string",
      "dateOfBirth": "2026-05-22",
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
    "orderingDoctor": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-22T05:15:20.465Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T05:15:20.465Z",
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
        "createdAt": "2026-05-22T05:15:20.465Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T05:15:20.465Z",
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
      "createdAt": "2026-05-22T05:15:20.465Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T05:15:20.465Z",
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
    "orderNumber": "string",
    "testName": "string",
    "testCode": "string",
    "sampleType": "string",
    "orderTime": "2026-05-22T05:15:20.465Z",
    "sampleCollectionTime": "2026-05-22T05:15:20.465Z",
    "resultTime": "2026-05-22T05:15:20.465Z",
    "status": "ORDERED",
    "result": "string",
    "remarks": "string"
  },
  "timestamp": "2026-05-22T05:15:20.465Z"
}
No links

DELETE
/api/v1/diagnostics/lab/{id}
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
  "timestamp": "2026-05-22T05:15:20.478Z"
}
No links
