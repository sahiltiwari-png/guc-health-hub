V1 - appointmentRoute
Enterprise APIs for scheduling and managing patient appointments



GET
/api/v1/appointments
Method Summary


Retrieves a paginated list of all appointments with filters

Parameters
Try it out
Name	Description
status
string
(query)
status
date
string($date)
(query)
date
startDate
string($date)
(query)
startDate
endDate
string($date)
(query)
endDate
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
        "patientId": 9007199254740991,
        "patientName": "string",
        "doctorId": 9007199254740991,
        "doctorName": "string",
        "departmentId": 9007199254740991,
        "departmentName": "string",
        "appointmentDate": "2026-05-21",
        "appointmentTime": {
          "hour": 1073741824,
          "minute": 1073741824,
          "second": 1073741824,
          "nano": 1073741824
        },
        "tokenNumber": "string",
        "status": "PENDING",
        "priority": "NORMAL",
        "visitType": "string",
        "source": "string",
        "billed": true,
        "notes": "string",
        "cancellationReason": "string"
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
  "timestamp": "2026-05-21T16:47:34.993Z"
}
No links

POST
/api/v1/appointments
Create a new appointment


Schedules a new appointment for a patient with a specific doctor and department. Allowed visitType values: OPD, IPD, EMERGENCY

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
date *
string($date)
(query)
date
visitType *
string
(query)
visitType
priority
string
(query)
priority
source
string
(query)
source
notes
string
(query)
notes
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
    "patientId": 9007199254740991,
    "patientName": "string",
    "doctorId": 9007199254740991,
    "doctorName": "string",
    "departmentId": 9007199254740991,
    "departmentName": "string",
    "appointmentDate": "2026-05-21",
    "appointmentTime": {
      "hour": 1073741824,
      "minute": 1073741824,
      "second": 1073741824,
      "nano": 1073741824
    },
    "tokenNumber": "string",
    "status": "PENDING",
    "priority": "NORMAL",
    "visitType": "string",
    "source": "string",
    "billed": true,
    "notes": "string",
    "cancellationReason": "string"
  },
  "timestamp": "2026-05-21T16:47:35.004Z"
}
No links

GET
/api/v1/appointments/{id}
Method Summary


Retrieves details of a specific appointment

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
    "patientId": 9007199254740991,
    "patientName": "string",
    "doctorId": 9007199254740991,
    "doctorName": "string",
    "departmentId": 9007199254740991,
    "departmentName": "string",
    "appointmentDate": "2026-05-21",
    "appointmentTime": {
      "hour": 1073741824,
      "minute": 1073741824,
      "second": 1073741824,
      "nano": 1073741824
    },
    "tokenNumber": "string",
    "status": "PENDING",
    "priority": "NORMAL",
    "visitType": "string",
    "source": "string",
    "billed": true,
    "notes": "string",
    "cancellationReason": "string"
  },
  "timestamp": "2026-05-21T16:47:35.011Z"
}
No links

PUT
/api/v1/appointments/{id}
Update appointment


Updates an existing appointment profile

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
  "createdAt": "2026-05-21T16:47:35.022Z",
  "createdBy": "string",
  "updatedAt": "2026-05-21T16:47:35.022Z",
  "updatedBy": "string",
  "deleted": true,
  "patient": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-21T16:47:35.022Z",
    "createdBy": "string",
    "updatedAt": "2026-05-21T16:47:35.022Z",
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
  "doctor": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-21T16:47:35.022Z",
    "createdBy": "string",
    "updatedAt": "2026-05-21T16:47:35.022Z",
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
      "createdAt": "2026-05-21T16:47:35.022Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:47:35.023Z",
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
    "createdAt": "2026-05-21T16:47:35.023Z",
    "createdBy": "string",
    "updatedAt": "2026-05-21T16:47:35.023Z",
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
  "appointmentDate": "2026-05-21",
  "appointmentTime": {
    "hour": 1073741824,
    "minute": 1073741824,
    "second": 1073741824,
    "nano": 1073741824
  },
  "tokenNumber": "string",
  "status": "PENDING",
  "priority": "NORMAL",
  "chiefComplaint": "string",
  "visitType": "string",
  "source": "string",
  "notes": "string",
  "cancellationReason": "string",
  "billed": true
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
    "createdAt": "2026-05-21T16:47:35.046Z",
    "createdBy": "string",
    "updatedAt": "2026-05-21T16:47:35.046Z",
    "updatedBy": "string",
    "deleted": true,
    "patient": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-21T16:47:35.046Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:47:35.046Z",
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
    "doctor": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-21T16:47:35.046Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:47:35.046Z",
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
        "createdAt": "2026-05-21T16:47:35.047Z",
        "createdBy": "string",
        "updatedAt": "2026-05-21T16:47:35.047Z",
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
      "createdAt": "2026-05-21T16:47:35.047Z",
      "createdBy": "string",
      "updatedAt": "2026-05-21T16:47:35.047Z",
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
    "appointmentDate": "2026-05-21",
    "appointmentTime": {
      "hour": 1073741824,
      "minute": 1073741824,
      "second": 1073741824,
      "nano": 1073741824
    },
    "tokenNumber": "string",
    "status": "PENDING",
    "priority": "NORMAL",
    "chiefComplaint": "string",
    "visitType": "string",
    "source": "string",
    "notes": "string",
    "cancellationReason": "string",
    "billed": true
  },
  "timestamp": "2026-05-21T16:47:35.047Z"
}
No links

DELETE
/api/v1/appointments/{id}
Method Summary


Deletes an appointment record

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
  "timestamp": "2026-05-21T16:47:35.064Z"
}
No links

PATCH
/api/v1/appointments/{id}/status
Update appointment status


Updates the status of an appointment (e.g., CONFIRMED, CANCELLED, COMPLETED)

Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
status *
string
(query)
status
cancellationReason
string
(query)
cancellationReason
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
    "patientId": 9007199254740991,
    "patientName": "string",
    "doctorId": 9007199254740991,
    "doctorName": "string",
    "departmentId": 9007199254740991,
    "departmentName": "string",
    "appointmentDate": "2026-05-21",
    "appointmentTime": {
      "hour": 1073741824,
      "minute": 1073741824,
      "second": 1073741824,
      "nano": 1073741824
    },
    "tokenNumber": "string",
    "status": "PENDING",
    "priority": "NORMAL",
    "visitType": "string",
    "source": "string",
    "billed": true,
    "notes": "string",
    "cancellationReason": "string"
  },
  "timestamp": "2026-05-21T16:47:35.068Z"
}
No links

GET
/api/v1/appointments/daily
Method Summary


Retrieves all appointments scheduled for a specific date

Parameters
Try it out
Name	Description
date *
string($date)
(query)
date
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
        "patientId": 9007199254740991,
        "patientName": "string",
        "doctorId": 9007199254740991,
        "doctorName": "string",
        "departmentId": 9007199254740991,
        "departmentName": "string",
        "appointmentDate": "2026-05-21",
        "appointmentTime": {
          "hour": 1073741824,
          "minute": 1073741824,
          "second": 1073741824,
          "nano": 1073741824
        },
        "tokenNumber": "string",
        "status": "PENDING",
        "priority": "NORMAL",
        "visitType": "string",
        "source": "string",
        "billed": true,
        "notes": "string",
        "cancellationReason": "string"
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
  "timestamp": "2026-05-21T16:47:35.076Z"
}
No links

GET
/api/v1/appointments/doctor/{doctorId}
Method Summary


Retrieves all appointments for a specific doctor

Parameters
Try it out
Name	Description
doctorId *
integer($int64)
(path)
doctorId
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
        "patientId": 9007199254740991,
        "patientName": "string",
        "doctorId": 9007199254740991,
        "doctorName": "string",
        "departmentId": 9007199254740991,
        "departmentName": "string",
        "appointmentDate": "2026-05-21",
        "appointmentTime": {
          "hour": 1073741824,
          "minute": 1073741824,
          "second": 1073741824,
          "nano": 1073741824
        },
        "tokenNumber": "string",
        "status": "PENDING",
        "priority": "NORMAL",
        "visitType": "string",
        "source": "string",
        "billed": true,
        "notes": "string",
        "cancellationReason": "string"
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
  "timestamp": "2026-05-21T16:47:35.086Z"
}
No links

GET
/api/v1/appointments/patient/{patientId}
Method Summary


Retrieves all appointments for a specific patient

Parameters
Try it out
Name	Description
patientId *
integer($int64)
(path)
patientId
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
        "patientId": 9007199254740991,
        "patientName": "string",
        "doctorId": 9007199254740991,
        "doctorName": "string",
        "departmentId": 9007199254740991,
        "departmentName": "string",
        "appointmentDate": "2026-05-21",
        "appointmentTime": {
          "hour": 1073741824,
          "minute": 1073741824,
          "second": 1073741824,
          "nano": 1073741824
        },
        "tokenNumber": "string",
        "status": "PENDING",
        "priority": "NORMAL",
        "visitType": "string",
        "source": "string",
        "billed": true,
        "notes": "string",
        "cancellationReason": "string"
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
  "timestamp": "2026-05-21T16:47:35.096Z"
}
No links

GET
/api/v1/appointments/search
Search appointments


Filters appointments by patient, doctor, department, date range, and status

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
startDate
string($date)
(query)
startDate
endDate
string($date)
(query)
endDate
status
string
(query)
status
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
        "patientId": 9007199254740991,
        "patientName": "string",
        "doctorId": 9007199254740991,
        "doctorName": "string",
        "departmentId": 9007199254740991,
        "departmentName": "string",
        "appointmentDate": "2026-05-21",
        "appointmentTime": {
          "hour": 1073741824,
          "minute": 1073741824,
          "second": 1073741824,
          "nano": 1073741824
        },
        "tokenNumber": "string",
        "status": "PENDING",
        "priority": "NORMAL",
        "visitType": "string",
        "source": "string",
        "billed": true,
        "notes": "string",
        "cancellationReason": "string"
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
  "timestamp": "2026-05-21T16:47:35.107Z"
}
