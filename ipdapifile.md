V1 - ipdRoute
Enterprise APIs for managing wards, beds, admissions, and discharges



GET
/api/v1/ipd
Method Summary


Retrieves a paginated list of all IPD admissions

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
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-21T16:00:39.679Z",
        "createdBy": "string",
        "updatedAt": "2026-05-21T16:00:39.679Z",
        "updatedBy": "string",
        "deleted": true,
        "patient": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-21T16:00:39.679Z",
          "createdBy": "string",
          "updatedAt": "2026-05-21T16:00:39.679Z",
          "updatedBy": "string",
          "deleted": true,
          "firstName": "string",
          "lastName": "string",
          "gender": "string",
          "dateOfBirth": "2026-05-21",
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
          "createdAt": "2026-05-21T16:00:39.679Z",
          "createdBy": "string",
          "updatedAt": "2026-05-21T16:00:39.679Z",
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
            "createdAt": "2026-05-21T16:00:39.679Z",
            "createdBy": "string",
            "updatedAt": "2026-05-21T16:00:39.679Z",
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
          "createdAt": "2026-05-21T16:00:39.680Z",
          "createdBy": "string",
          "updatedAt": "2026-05-21T16:00:39.680Z",
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
            "createdAt": "2026-05-21T16:00:39.680Z",
            "createdBy": "string",
            "updatedAt": "2026-05-21T16:00:39.680Z",
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
          "createdAt": "2026-05-21T16:00:39.680Z",
          "createdBy": "string",
          "updatedAt": "2026-05-21T16:00:39.680Z",
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
          "createdAt": "2026-05-21T16:00:39.680Z",
          "createdBy": "string",
          "updatedAt": "2026-05-21T16:00:39.680Z",
          "updatedBy": "string",
          "deleted": true,
          "ward": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-21T16:00:39.680Z",
            "createdBy": "string",
            "updatedAt": "2026-05-21T16:00:39.680Z",
            "updatedBy": "string",
            "deleted": true,
            "name": "string",
            "type": "ICU",
            "department": {
              "id": 9007199254740991,
              "hospitalId": 9007199254740991,
              "branchId": 9007199254740991,
              "createdAt": "2026-05-21T16:00:39.680Z",
              "createdBy": "string",
              "updatedAt": "2026-05-21T16:00:39.680Z",
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
        "admissionDate": "2026-05-21T16:00:39.680Z",
        "dischargeDate": "2026-05-21T16:00:39.680Z",
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
  "timestamp": "2026-05-21T16:00:39.680Z"
}
No links

GET
/api/v1/ipd/{id}
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
    "createdAt": "2026-05-21T16:00:39.711Z",
    "createdBy": "string",
    "updatedAt": "2026-05-21T16:00:39.711Z",
    "updatedBy": "string",
    "deleted": true,
    "patient": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-21T16:00:39.711Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:00:39.711Z",
      "updatedBy": "string",
      "deleted": true,
      "firstName": "string",
      "lastName": "string",
      "gender": "string",
      "dateOfBirth": "2026-05-21",
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
      "createdAt": "2026-05-21T16:00:39.711Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:00:39.711Z",
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
        "createdAt": "2026-05-21T16:00:39.712Z",
        "createdBy": "string",
        "updatedAt": "2026-05-21T16:00:39.712Z",
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
      "createdAt": "2026-05-21T16:00:39.712Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:00:39.712Z",
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
        "createdAt": "2026-05-21T16:00:39.712Z",
        "createdBy": "string",
        "updatedAt": "2026-05-21T16:00:39.712Z",
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
      "createdAt": "2026-05-21T16:00:39.712Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:00:39.712Z",
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
      "createdAt": "2026-05-21T16:00:39.713Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:00:39.713Z",
      "updatedBy": "string",
      "deleted": true,
      "ward": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-21T16:00:39.713Z",
        "createdBy": "string",
        "updatedAt": "2026-05-21T16:00:39.713Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "type": "ICU",
        "department": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-21T16:00:39.713Z",
          "createdBy": "string",
          "updatedAt": "2026-05-21T16:00:39.713Z",
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
    "admissionDate": "2026-05-21T16:00:39.713Z",
    "dischargeDate": "2026-05-21T16:00:39.713Z",
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
  "timestamp": "2026-05-21T16:00:39.713Z"
}
No links

PUT
/api/v1/ipd/{id}
Update admission


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
  "createdAt": "2026-05-21T16:00:39.747Z",
  "createdBy": "string",
  "updatedAt": "2026-05-21T16:00:39.747Z",
  "updatedBy": "string",
  "deleted": true,
  "patient": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-21T16:00:39.747Z",
    "createdBy": "string",
    "updatedAt": "2026-05-21T16:00:39.747Z",
    "updatedBy": "string",
    "deleted": true,
    "firstName": "string",
    "lastName": "string",
    "gender": "string",
    "dateOfBirth": "2026-05-21",
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
    "createdAt": "2026-05-21T16:00:39.747Z",
    "createdBy": "string",
    "updatedAt": "2026-05-21T16:00:39.747Z",
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
      "createdAt": "2026-05-21T16:00:39.747Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:00:39.747Z",
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
    "createdAt": "2026-05-21T16:00:39.747Z",
    "createdBy": "string",
    "updatedAt": "2026-05-21T16:00:39.747Z",
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
      "createdAt": "2026-05-21T16:00:39.748Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:00:39.748Z",
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
    "createdAt": "2026-05-21T16:00:39.748Z",
    "createdBy": "string",
    "updatedAt": "2026-05-21T16:00:39.748Z",
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
    "createdAt": "2026-05-21T16:00:39.748Z",
    "createdBy": "string",
    "updatedAt": "2026-05-21T16:00:39.748Z",
    "updatedBy": "string",
    "deleted": true,
    "ward": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-21T16:00:39.748Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:00:39.748Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "type": "ICU",
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-21T16:00:39.748Z",
        "createdBy": "string",
        "updatedAt": "2026-05-21T16:00:39.748Z",
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
  "admissionDate": "2026-05-21T16:00:39.748Z",
  "dischargeDate": "2026-05-21T16:00:39.748Z",
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
    "createdAt": "2026-05-21T16:00:39.772Z",
    "createdBy": "string",
    "updatedAt": "2026-05-21T16:00:39.772Z",
    "updatedBy": "string",
    "deleted": true,
    "patient": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-21T16:00:39.772Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:00:39.772Z",
      "updatedBy": "string",
      "deleted": true,
      "firstName": "string",
      "lastName": "string",
      "gender": "string",
      "dateOfBirth": "2026-05-21",
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
      "createdAt": "2026-05-21T16:00:39.772Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:00:39.772Z",
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
        "createdAt": "2026-05-21T16:00:39.772Z",
        "createdBy": "string",
        "updatedAt": "2026-05-21T16:00:39.772Z",
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
      "createdAt": "2026-05-21T16:00:39.773Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:00:39.773Z",
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
        "createdAt": "2026-05-21T16:00:39.773Z",
        "createdBy": "string",
        "updatedAt": "2026-05-21T16:00:39.773Z",
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
      "createdAt": "2026-05-21T16:00:39.773Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:00:39.773Z",
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
      "createdAt": "2026-05-21T16:00:39.773Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:00:39.773Z",
      "updatedBy": "string",
      "deleted": true,
      "ward": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-21T16:00:39.773Z",
        "createdBy": "string",
        "updatedAt": "2026-05-21T16:00:39.773Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "type": "ICU",
        "department": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-21T16:00:39.773Z",
          "createdBy": "string",
          "updatedAt": "2026-05-21T16:00:39.773Z",
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
    "admissionDate": "2026-05-21T16:00:39.773Z",
    "dischargeDate": "2026-05-21T16:00:39.773Z",
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
  "timestamp": "2026-05-21T16:00:39.773Z"
}
No links

DELETE
/api/v1/ipd/{id}
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
  "timestamp": "2026-05-21T16:00:39.806Z"
}
No links

GET
/api/v1/ipd/admissions/search
Search admissions


Filters admissions by patient, doctor, department, status, and ward type.

Parameters
Try it out
Name	Description
patientId
integer($int64)
(query)
patientId
doctorId
integer($int64)
(query)
doctorId
departmentId
integer($int64)
(query)
departmentId
status
string
(query)
status
wardType
string
(query)
wardType
filter
string
(query)
filter
start
string($date-time)
(query)
start
end
string($date-time)
(query)
end
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
        "createdAt": "2026-05-21T16:00:39.819Z",
        "createdBy": "string",
        "updatedAt": "2026-05-21T16:00:39.819Z",
        "updatedBy": "string",
        "deleted": true,
        "patient": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-21T16:00:39.819Z",
          "createdBy": "string",
          "updatedAt": "2026-05-21T16:00:39.819Z",
          "updatedBy": "string",
          "deleted": true,
          "firstName": "string",
          "lastName": "string",
          "gender": "string",
          "dateOfBirth": "2026-05-21",
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
          "createdAt": "2026-05-21T16:00:39.819Z",
          "createdBy": "string",
          "updatedAt": "2026-05-21T16:00:39.819Z",
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
            "createdAt": "2026-05-21T16:00:39.819Z",
            "createdBy": "string",
            "updatedAt": "2026-05-21T16:00:39.819Z",
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
          "createdAt": "2026-05-21T16:00:39.819Z",
          "createdBy": "string",
          "updatedAt": "2026-05-21T16:00:39.819Z",
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
            "createdAt": "2026-05-21T16:00:39.819Z",
            "createdBy": "string",
            "updatedAt": "2026-05-21T16:00:39.819Z",
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
          "createdAt": "2026-05-21T16:00:39.820Z",
          "createdBy": "string",
          "updatedAt": "2026-05-21T16:00:39.820Z",
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
          "createdAt": "2026-05-21T16:00:39.820Z",
          "createdBy": "string",
          "updatedAt": "2026-05-21T16:00:39.820Z",
          "updatedBy": "string",
          "deleted": true,
          "ward": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-21T16:00:39.820Z",
            "createdBy": "string",
            "updatedAt": "2026-05-21T16:00:39.820Z",
            "updatedBy": "string",
            "deleted": true,
            "name": "string",
            "type": "ICU",
            "department": {
              "id": 9007199254740991,
              "hospitalId": 9007199254740991,
              "branchId": 9007199254740991,
              "createdAt": "2026-05-21T16:00:39.820Z",
              "createdBy": "string",
              "updatedAt": "2026-05-21T16:00:39.820Z",
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
        "admissionDate": "2026-05-21T16:00:39.820Z",
        "dischargeDate": "2026-05-21T16:00:39.820Z",
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
  "timestamp": "2026-05-21T16:00:39.820Z"
}
No links

POST
/api/v1/ipd/admit
Admit patient


Admits a patient to a specific bed under a doctor's care

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
    "createdAt": "2026-05-21T16:00:39.853Z",
    "createdBy": "string",
    "updatedAt": "2026-05-21T16:00:39.853Z",
    "updatedBy": "string",
    "deleted": true,
    "patient": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-21T16:00:39.853Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:00:39.853Z",
      "updatedBy": "string",
      "deleted": true,
      "firstName": "string",
      "lastName": "string",
      "gender": "string",
      "dateOfBirth": "2026-05-21",
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
      "createdAt": "2026-05-21T16:00:39.853Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:00:39.853Z",
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
        "createdAt": "2026-05-21T16:00:39.854Z",
        "createdBy": "string",
        "updatedAt": "2026-05-21T16:00:39.854Z",
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
      "createdAt": "2026-05-21T16:00:39.854Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:00:39.854Z",
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
        "createdAt": "2026-05-21T16:00:39.854Z",
        "createdBy": "string",
        "updatedAt": "2026-05-21T16:00:39.854Z",
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
      "createdAt": "2026-05-21T16:00:39.854Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:00:39.854Z",
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
      "createdAt": "2026-05-21T16:00:39.854Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:00:39.854Z",
      "updatedBy": "string",
      "deleted": true,
      "ward": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-21T16:00:39.854Z",
        "createdBy": "string",
        "updatedAt": "2026-05-21T16:00:39.854Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "type": "ICU",
        "department": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-21T16:00:39.854Z",
          "createdBy": "string",
          "updatedAt": "2026-05-21T16:00:39.854Z",
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
    "admissionDate": "2026-05-21T16:00:39.854Z",
    "dischargeDate": "2026-05-21T16:00:39.854Z",
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
  "timestamp": "2026-05-21T16:00:39.854Z"
}