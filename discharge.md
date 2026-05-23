POST
/api/v1/clinical/discharge-summary
Create discharge summary


Creates a discharge summary and updates admission status

Parameters
Try it out
Name	Description
admissionId *
integer($int64)
(query)
admissionId
Request body

application/json
Example Value
Schema
{
  "id": 9007199254740991,
  "hospitalId": 9007199254740991,
  "branchId": 9007199254740991,
  "createdAt": "2026-05-22T16:48:03.804Z",
  "createdBy": "string",
  "updatedAt": "2026-05-22T16:48:03.804Z",
  "updatedBy": "string",
  "deleted": true,
  "admission": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-22T16:48:03.804Z",
    "createdBy": "string",
    "updatedAt": "2026-05-22T16:48:03.804Z",
    "updatedBy": "string",
    "deleted": true,
    "patient": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-22T16:48:03.804Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T16:48:03.804Z",
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
    "admittingDoctor": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-22T16:48:03.805Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T16:48:03.805Z",
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
        "createdAt": "2026-05-22T16:48:03.806Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T16:48:03.806Z",
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
      "createdAt": "2026-05-22T16:48:03.806Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T16:48:03.806Z",
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
        "createdAt": "2026-05-22T16:48:03.807Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T16:48:03.807Z",
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
      "createdAt": "2026-05-22T16:48:03.808Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T16:48:03.808Z",
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
      "createdAt": "2026-05-22T16:48:03.810Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T16:48:03.810Z",
      "updatedBy": "string",
      "deleted": true,
      "ward": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-22T16:48:03.810Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T16:48:03.810Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "type": "ICU",
        "department": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-22T16:48:03.810Z",
          "createdBy": "string",
          "updatedAt": "2026-05-22T16:48:03.810Z",
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
    "admissionDate": "2026-05-22T16:48:03.811Z",
    "dischargeDate": "2026-05-22T16:48:03.811Z",
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
  "dischargeTime": "2026-05-22T16:48:03.811Z",
  "dischargeDiagnosis": "string",
  "summaryOfCase": "string",
  "treatmentGiven": "string",
  "medicationsAtDischarge": "string",
  "followUpInstructions": "string",
  "dischargeType": "NORMAL"
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
    "createdAt": "2026-05-22T16:48:03.953Z",
    "createdBy": "string",
    "updatedAt": "2026-05-22T16:48:03.953Z",
    "updatedBy": "string",
    "deleted": true,
    "admission": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-22T16:48:03.953Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T16:48:03.953Z",
      "updatedBy": "string",
      "deleted": true,
      "patient": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-22T16:48:03.953Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T16:48:03.953Z",
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
      "admittingDoctor": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-22T16:48:03.953Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T16:48:03.953Z",
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
          "createdAt": "2026-05-22T16:48:03.954Z",
          "createdBy": "string",
          "updatedAt": "2026-05-22T16:48:03.954Z",
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
        "createdAt": "2026-05-22T16:48:03.954Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T16:48:03.955Z",
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
          "createdAt": "2026-05-22T16:48:03.955Z",
          "createdBy": "string",
          "updatedAt": "2026-05-22T16:48:03.955Z",
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
        "createdAt": "2026-05-22T16:48:03.955Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T16:48:03.955Z",
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
        "createdAt": "2026-05-22T16:48:03.955Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T16:48:03.955Z",
        "updatedBy": "string",
        "deleted": true,
        "ward": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-22T16:48:03.956Z",
          "createdBy": "string",
          "updatedAt": "2026-05-22T16:48:03.956Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "type": "ICU",
          "department": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-22T16:48:03.956Z",
            "createdBy": "string",
            "updatedAt": "2026-05-22T16:48:03.956Z",
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
      "admissionDate": "2026-05-22T16:48:03.956Z",
      "dischargeDate": "2026-05-22T16:48:03.956Z",
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
    "dischargeTime": "2026-05-22T16:48:03.956Z",
    "dischargeDiagnosis": "string",
    "summaryOfCase": "string",
    "treatmentGiven": "string",
    "medicationsAtDischarge": "string",
    "followUpInstructions": "string",
    "dischargeType": "NORMAL"
  },
  "timestamp": "2026-05-22T16:48:03.956Z"
}
No links

GET
/api/v1/clinical/discharge-summary/admission/{admissionId}
Method Summary


Parameters
Try it out
Name	Description
admissionId *
integer($int64)
(path)
admissionId
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
    "createdAt": "2026-05-22T16:48:04.063Z",
    "createdBy": "string",
    "updatedAt": "2026-05-22T16:48:04.063Z",
    "updatedBy": "string",
    "deleted": true,
    "admission": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-22T16:48:04.063Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T16:48:04.063Z",
      "updatedBy": "string",
      "deleted": true,
      "patient": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-22T16:48:04.063Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T16:48:04.064Z",
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
      "admittingDoctor": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-22T16:48:04.064Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T16:48:04.064Z",
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
          "createdAt": "2026-05-22T16:48:04.065Z",
          "createdBy": "string",
          "updatedAt": "2026-05-22T16:48:04.065Z",
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
        "createdAt": "2026-05-22T16:48:04.066Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T16:48:04.066Z",
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
          "createdAt": "2026-05-22T16:48:04.067Z",
          "createdBy": "string",
          "updatedAt": "2026-05-22T16:48:04.067Z",
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
        "createdAt": "2026-05-22T16:48:04.068Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T16:48:04.068Z",
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
        "createdAt": "2026-05-22T16:48:04.068Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T16:48:04.069Z",
        "updatedBy": "string",
        "deleted": true,
        "ward": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-22T16:48:04.069Z",
          "createdBy": "string",
          "updatedAt": "2026-05-22T16:48:04.069Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "type": "ICU",
          "department": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-22T16:48:04.069Z",
            "createdBy": "string",
            "updatedAt": "2026-05-22T16:48:04.069Z",
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
      "admissionDate": "2026-05-22T16:48:04.070Z",
      "dischargeDate": "2026-05-22T16:48:04.070Z",
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
    "dischargeTime": "2026-05-22T16:48:04.070Z",
    "dischargeDiagnosis": "string",
    "summaryOfCase": "string",
    "treatmentGiven": "string",
    "medicationsAtDischarge": "string",
    "followUpInstructions": "string",
    "dischargeType": "NORMAL"
  },
  "timestamp": "2026-05-22T16:48:04.070Z"
}
POST
/api/v1/ipd/discharge/{admissionId}
Discharge patient


Discharges a patient from the hospital and releases the bed

Parameters
Try it out
Name	Description
admissionId *
integer($int64)
(path)
admissionId
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
    "createdAt": "2026-05-22T16:52:32.865Z",
    "createdBy": "string",
    "updatedAt": "2026-05-22T16:52:32.865Z",
    "updatedBy": "string",
    "deleted": true,
    "patient": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-22T16:52:32.865Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T16:52:32.865Z",
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
    "admittingDoctor": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-22T16:52:32.865Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T16:52:32.865Z",
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
        "createdAt": "2026-05-22T16:52:32.865Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T16:52:32.865Z",
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
      "createdAt": "2026-05-22T16:52:32.866Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T16:52:32.866Z",
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
        "createdAt": "2026-05-22T16:52:32.866Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T16:52:32.866Z",
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
      "createdAt": "2026-05-22T16:52:32.866Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T16:52:32.866Z",
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
      "createdAt": "2026-05-22T16:52:32.866Z",
      "createdBy": "string",
      "updatedAt": "2026-05-22T16:52:32.866Z",
      "updatedBy": "string",
      "deleted": true,
      "ward": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-22T16:52:32.866Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T16:52:32.866Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "type": "ICU",
        "department": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-22T16:52:32.866Z",
          "createdBy": "string",
          "updatedAt": "2026-05-22T16:52:32.866Z",
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
    "admissionDate": "2026-05-22T16:52:32.866Z",
    "dischargeDate": "2026-05-22T16:52:32.866Z",
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
  "timestamp": "2026-05-22T16:52:32.866Z"
}
No links

GET
/api/v1/ipd/discharged-today
List patients discharged today


Parameters
Try it out
Name	Description
pageable *
object
(query)
{
  "page": 1073741824,
  "size": 1073741824,
  "sort": [
    "string"
  ]
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
        "createdAt": "2026-05-22T16:52:32.904Z",
        "createdBy": "string",
        "updatedAt": "2026-05-22T16:52:32.904Z",
        "updatedBy": "string",
        "deleted": true,
        "patient": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-22T16:52:32.904Z",
          "createdBy": "string",
          "updatedAt": "2026-05-22T16:52:32.904Z",
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
        "admittingDoctor": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-22T16:52:32.904Z",
          "createdBy": "string",
          "updatedAt": "2026-05-22T16:52:32.904Z",
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
            "createdAt": "2026-05-22T16:52:32.905Z",
            "createdBy": "string",
            "updatedAt": "2026-05-22T16:52:32.905Z",
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
          "createdAt": "2026-05-22T16:52:32.905Z",
          "createdBy": "string",
          "updatedAt": "2026-05-22T16:52:32.905Z",
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
            "createdAt": "2026-05-22T16:52:32.905Z",
            "createdBy": "string",
            "updatedAt": "2026-05-22T16:52:32.905Z",
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
          "createdAt": "2026-05-22T16:52:32.905Z",
          "createdBy": "string",
          "updatedAt": "2026-05-22T16:52:32.905Z",
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
          "createdAt": "2026-05-22T16:52:32.905Z",
          "createdBy": "string",
          "updatedAt": "2026-05-22T16:52:32.905Z",
          "updatedBy": "string",
          "deleted": true,
          "ward": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-22T16:52:32.906Z",
            "createdBy": "string",
            "updatedAt": "2026-05-22T16:52:32.906Z",
            "updatedBy": "string",
            "deleted": true,
            "name": "string",
            "type": "ICU",
            "department": {
              "id": 9007199254740991,
              "hospitalId": 9007199254740991,
              "branchId": 9007199254740991,
              "createdAt": "2026-05-22T16:52:32.906Z",
              "createdBy": "string",
              "updatedAt": "2026-05-22T16:52:32.906Z",
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
        "admissionDate": "2026-05-22T16:52:32.906Z",
        "dischargeDate": "2026-05-22T16:52:32.906Z",
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
      "paged": true,
      "pageNumber": 1073741824,
      "pageSize": 1073741824,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2026-05-22T16:52:32.906Z"
}