Help Desk
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
  "timestamp": "2026-05-31T12:46:01.114Z"
}
No links

GET
/api/v1/helpdesk/tickets
List all tickets with filters


Parameters
Cancel
Name	Description
search
string
(query)
IT_SUPPORT,MIANTANCE, SOFTWARE, HARDWARE,NETWORK , OTHERS
status
string
(query)

--
priority
string
(query)

MEDIUM
category
string
(query)

--
page
integer($int32)
(query)
0
size
integer($int32)
(query)
10
Execute
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
    "size": 1073741824,
    "content": [
      {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.134Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.134Z",
        "updatedBy": "string",
        "deleted": true,
        "title": "string",
        "description": "string",
        "priority": "LOW",
        "status": "OPEN",
        "category": "IT_SUPPORT",
        "raisedBy": {
          "id": 9007199254740991,
          "username": "string",
          "password": "string",
          "email": "string",
          "phoneNumber": "string",
          "fullName": "string",
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "department": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-31T12:46:01.134Z",
            "createdBy": "string",
            "updatedAt": "2026-05-31T12:46:01.134Z",
            "updatedBy": "string",
            "deleted": true,
            "name": "string",
            "code": "string",
            "description": "string",
            "active": true,
            "headOfDepartment": "string",
            "building": {
              "id": 9007199254740991,
              "hospitalId": 9007199254740991,
              "branchId": 9007199254740991,
              "createdAt": "2026-05-31T12:46:01.134Z",
              "createdBy": "string",
              "updatedAt": "2026-05-31T12:46:01.134Z",
              "updatedBy": "string",
              "deleted": true,
              "name": "string",
              "code": "string",
              "description": "string",
              "active": true
            },
            "floor": {
              "id": 9007199254740991,
              "hospitalId": 9007199254740991,
              "branchId": 9007199254740991,
              "createdAt": "2026-05-31T12:46:01.134Z",
              "createdBy": "string",
              "updatedAt": "2026-05-31T12:46:01.135Z",
              "updatedBy": "string",
              "deleted": true,
              "building": {
                "id": 9007199254740991,
                "hospitalId": 9007199254740991,
                "branchId": 9007199254740991,
                "createdAt": "2026-05-31T12:46:01.135Z",
                "createdBy": "string",
                "updatedAt": "2026-05-31T12:46:01.135Z",
                "updatedBy": "string",
                "deleted": true,
                "name": "string",
                "code": "string",
                "description": "string",
                "active": true
              },
              "floorNumber": "string",
              "name": "string",
              "description": "string",
              "active": true
            },
            "location": "string",
            "contactNumber": "string",
            "email": "string",
            "totalBeds": 1073741824,
            "availableBeds": 1073741824
          },
          "building": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-31T12:46:01.135Z",
            "createdBy": "string",
            "updatedAt": "2026-05-31T12:46:01.135Z",
            "updatedBy": "string",
            "deleted": true,
            "name": "string",
            "code": "string",
            "description": "string",
            "active": true
          },
          "floor": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-31T12:46:01.135Z",
            "createdBy": "string",
            "updatedAt": "2026-05-31T12:46:01.135Z",
            "updatedBy": "string",
            "deleted": true,
            "building": {
              "id": 9007199254740991,
              "hospitalId": 9007199254740991,
              "branchId": 9007199254740991,
              "createdAt": "2026-05-31T12:46:01.135Z",
              "createdBy": "string",
              "updatedAt": "2026-05-31T12:46:01.135Z",
              "updatedBy": "string",
              "deleted": true,
              "name": "string",
              "code": "string",
              "description": "string",
              "active": true
            },
            "floorNumber": "string",
            "name": "string",
            "description": "string",
            "active": true
          },
          "global": true,
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
        "assignedTo": {
          "id": 9007199254740991,
          "username": "string",
          "password": "string",
          "email": "string",
          "phoneNumber": "string",
          "fullName": "string",
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "department": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-31T12:46:01.135Z",
            "createdBy": "string",
            "updatedAt": "2026-05-31T12:46:01.135Z",
            "updatedBy": "string",
            "deleted": true,
            "name": "string",
            "code": "string",
            "description": "string",
            "active": true,
            "headOfDepartment": "string",
            "building": {
              "id": 9007199254740991,
              "hospitalId": 9007199254740991,
              "branchId": 9007199254740991,
              "createdAt": "2026-05-31T12:46:01.135Z",
              "createdBy": "string",
              "updatedAt": "2026-05-31T12:46:01.135Z",
              "updatedBy": "string",
              "deleted": true,
              "name": "string",
              "code": "string",
              "description": "string",
              "active": true
            },
            "floor": {
              "id": 9007199254740991,
              "hospitalId": 9007199254740991,
              "branchId": 9007199254740991,
              "createdAt": "2026-05-31T12:46:01.135Z",
              "createdBy": "string",
              "updatedAt": "2026-05-31T12:46:01.135Z",
              "updatedBy": "string",
              "deleted": true,
              "building": {
                "id": 9007199254740991,
                "hospitalId": 9007199254740991,
                "branchId": 9007199254740991,
                "createdAt": "2026-05-31T12:46:01.135Z",
                "createdBy": "string",
                "updatedAt": "2026-05-31T12:46:01.135Z",
                "updatedBy": "string",
                "deleted": true,
                "name": "string",
                "code": "string",
                "description": "string",
                "active": true
              },
              "floorNumber": "string",
              "name": "string",
              "description": "string",
              "active": true
            },
            "location": "string",
            "contactNumber": "string",
            "email": "string",
            "totalBeds": 1073741824,
            "availableBeds": 1073741824
          },
          "building": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-31T12:46:01.136Z",
            "createdBy": "string",
            "updatedAt": "2026-05-31T12:46:01.136Z",
            "updatedBy": "string",
            "deleted": true,
            "name": "string",
            "code": "string",
            "description": "string",
            "active": true
          },
          "floor": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-31T12:46:01.136Z",
            "createdBy": "string",
            "updatedAt": "2026-05-31T12:46:01.136Z",
            "updatedBy": "string",
            "deleted": true,
            "building": {
              "id": 9007199254740991,
              "hospitalId": 9007199254740991,
              "branchId": 9007199254740991,
              "createdAt": "2026-05-31T12:46:01.136Z",
              "createdBy": "string",
              "updatedAt": "2026-05-31T12:46:01.136Z",
              "updatedBy": "string",
              "deleted": true,
              "name": "string",
              "code": "string",
              "description": "string",
              "active": true
            },
            "floorNumber": "string",
            "name": "string",
            "description": "string",
            "active": true
          },
          "global": true,
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
        "resolution": "string"
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
    "first": true,
    "last": true,
    "empty": true
  },
  "timestamp": "2026-05-31T12:46:01.136Z"
}
No links

POST
/api/v1/helpdesk/tickets
Raise a new ticket


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
  "createdAt": "2026-05-31T12:46:01.198Z",
  "createdBy": "string",
  "updatedAt": "2026-05-31T12:46:01.198Z",
  "updatedBy": "string",
  "deleted": true,
  "title": "string",
  "description": "string",
  "priority": "LOW",
  "status": "OPEN",
  "category": "IT_SUPPORT",
  "raisedBy": {
    "id": 9007199254740991,
    "username": "string",
    "password": "string",
    "email": "string",
    "phoneNumber": "string",
    "fullName": "string",
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "department": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-31T12:46:01.198Z",
      "createdBy": "string",
      "updatedAt": "2026-05-31T12:46:01.198Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "active": true,
      "headOfDepartment": "string",
      "building": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.198Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.198Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true
      },
      "floor": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.199Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.199Z",
        "updatedBy": "string",
        "deleted": true,
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.199Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.199Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floorNumber": "string",
        "name": "string",
        "description": "string",
        "active": true
      },
      "location": "string",
      "contactNumber": "string",
      "email": "string",
      "totalBeds": 1073741824,
      "availableBeds": 1073741824
    },
    "building": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-31T12:46:01.199Z",
      "createdBy": "string",
      "updatedAt": "2026-05-31T12:46:01.199Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "active": true
    },
    "floor": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-31T12:46:01.199Z",
      "createdBy": "string",
      "updatedAt": "2026-05-31T12:46:01.199Z",
      "updatedBy": "string",
      "deleted": true,
      "building": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.199Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.199Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true
      },
      "floorNumber": "string",
      "name": "string",
      "description": "string",
      "active": true
    },
    "global": true,
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
  "assignedTo": {
    "id": 9007199254740991,
    "username": "string",
    "password": "string",
    "email": "string",
    "phoneNumber": "string",
    "fullName": "string",
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "department": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-31T12:46:01.199Z",
      "createdBy": "string",
      "updatedAt": "2026-05-31T12:46:01.199Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "active": true,
      "headOfDepartment": "string",
      "building": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.199Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.199Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true
      },
      "floor": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.199Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.199Z",
        "updatedBy": "string",
        "deleted": true,
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.199Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.199Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floorNumber": "string",
        "name": "string",
        "description": "string",
        "active": true
      },
      "location": "string",
      "contactNumber": "string",
      "email": "string",
      "totalBeds": 1073741824,
      "availableBeds": 1073741824
    },
    "building": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-31T12:46:01.199Z",
      "createdBy": "string",
      "updatedAt": "2026-05-31T12:46:01.199Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "active": true
    },
    "floor": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-31T12:46:01.200Z",
      "createdBy": "string",
      "updatedAt": "2026-05-31T12:46:01.200Z",
      "updatedBy": "string",
      "deleted": true,
      "building": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.200Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.200Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true
      },
      "floorNumber": "string",
      "name": "string",
      "description": "string",
      "active": true
    },
    "global": true,
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
  "resolution": "string"
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
    "createdAt": "2026-05-31T12:46:01.239Z",
    "createdBy": "string",
    "updatedAt": "2026-05-31T12:46:01.239Z",
    "updatedBy": "string",
    "deleted": true,
    "title": "string",
    "description": "string",
    "priority": "LOW",
    "status": "OPEN",
    "category": "IT_SUPPORT",
    "raisedBy": {
      "id": 9007199254740991,
      "username": "string",
      "password": "string",
      "email": "string",
      "phoneNumber": "string",
      "fullName": "string",
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.239Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.239Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true,
        "headOfDepartment": "string",
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.239Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.239Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floor": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.239Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.239Z",
          "updatedBy": "string",
          "deleted": true,
          "building": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-31T12:46:01.239Z",
            "createdBy": "string",
            "updatedAt": "2026-05-31T12:46:01.239Z",
            "updatedBy": "string",
            "deleted": true,
            "name": "string",
            "code": "string",
            "description": "string",
            "active": true
          },
          "floorNumber": "string",
          "name": "string",
          "description": "string",
          "active": true
        },
        "location": "string",
        "contactNumber": "string",
        "email": "string",
        "totalBeds": 1073741824,
        "availableBeds": 1073741824
      },
      "building": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.240Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.240Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true
      },
      "floor": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.240Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.240Z",
        "updatedBy": "string",
        "deleted": true,
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.240Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.240Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floorNumber": "string",
        "name": "string",
        "description": "string",
        "active": true
      },
      "global": true,
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
    "assignedTo": {
      "id": 9007199254740991,
      "username": "string",
      "password": "string",
      "email": "string",
      "phoneNumber": "string",
      "fullName": "string",
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.240Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.240Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true,
        "headOfDepartment": "string",
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.240Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.240Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floor": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.240Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.240Z",
          "updatedBy": "string",
          "deleted": true,
          "building": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-31T12:46:01.240Z",
            "createdBy": "string",
            "updatedAt": "2026-05-31T12:46:01.240Z",
            "updatedBy": "string",
            "deleted": true,
            "name": "string",
            "code": "string",
            "description": "string",
            "active": true
          },
          "floorNumber": "string",
          "name": "string",
          "description": "string",
          "active": true
        },
        "location": "string",
        "contactNumber": "string",
        "email": "string",
        "totalBeds": 1073741824,
        "availableBeds": 1073741824
      },
      "building": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.240Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.240Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true
      },
      "floor": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.240Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.240Z",
        "updatedBy": "string",
        "deleted": true,
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.241Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.241Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floorNumber": "string",
        "name": "string",
        "description": "string",
        "active": true
      },
      "global": true,
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
    "resolution": "string"
  },
  "timestamp": "2026-05-31T12:46:01.241Z"
}
No links

GET
/api/v1/helpdesk/tickets/{id}
Get ticket details


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
    "createdAt": "2026-05-31T12:46:01.323Z",
    "createdBy": "string",
    "updatedAt": "2026-05-31T12:46:01.323Z",
    "updatedBy": "string",
    "deleted": true,
    "title": "string",
    "description": "string",
    "priority": "LOW",
    "status": "OPEN",
    "category": "IT_SUPPORT",
    "raisedBy": {
      "id": 9007199254740991,
      "username": "string",
      "password": "string",
      "email": "string",
      "phoneNumber": "string",
      "fullName": "string",
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.323Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.323Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true,
        "headOfDepartment": "string",
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.323Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.323Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floor": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.323Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.323Z",
          "updatedBy": "string",
          "deleted": true,
          "building": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-31T12:46:01.323Z",
            "createdBy": "string",
            "updatedAt": "2026-05-31T12:46:01.323Z",
            "updatedBy": "string",
            "deleted": true,
            "name": "string",
            "code": "string",
            "description": "string",
            "active": true
          },
          "floorNumber": "string",
          "name": "string",
          "description": "string",
          "active": true
        },
        "location": "string",
        "contactNumber": "string",
        "email": "string",
        "totalBeds": 1073741824,
        "availableBeds": 1073741824
      },
      "building": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.323Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.323Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true
      },
      "floor": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.323Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.323Z",
        "updatedBy": "string",
        "deleted": true,
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.324Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.324Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floorNumber": "string",
        "name": "string",
        "description": "string",
        "active": true
      },
      "global": true,
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
    "assignedTo": {
      "id": 9007199254740991,
      "username": "string",
      "password": "string",
      "email": "string",
      "phoneNumber": "string",
      "fullName": "string",
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.324Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.324Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true,
        "headOfDepartment": "string",
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.324Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.324Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floor": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.324Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.324Z",
          "updatedBy": "string",
          "deleted": true,
          "building": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-31T12:46:01.324Z",
            "createdBy": "string",
            "updatedAt": "2026-05-31T12:46:01.324Z",
            "updatedBy": "string",
            "deleted": true,
            "name": "string",
            "code": "string",
            "description": "string",
            "active": true
          },
          "floorNumber": "string",
          "name": "string",
          "description": "string",
          "active": true
        },
        "location": "string",
        "contactNumber": "string",
        "email": "string",
        "totalBeds": 1073741824,
        "availableBeds": 1073741824
      },
      "building": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.324Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.324Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true
      },
      "floor": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.324Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.324Z",
        "updatedBy": "string",
        "deleted": true,
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.324Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.324Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floorNumber": "string",
        "name": "string",
        "description": "string",
        "active": true
      },
      "global": true,
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
    "resolution": "string"
  },
  "timestamp": "2026-05-31T12:46:01.324Z"
}
No links

PUT
/api/v1/helpdesk/tickets/{id}
Update ticket details


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
  "createdAt": "2026-05-31T12:46:01.385Z",
  "createdBy": "string",
  "updatedAt": "2026-05-31T12:46:01.385Z",
  "updatedBy": "string",
  "deleted": true,
  "title": "string",
  "description": "string",
  "priority": "LOW",
  "status": "OPEN",
  "category": "IT_SUPPORT",
  "raisedBy": {
    "id": 9007199254740991,
    "username": "string",
    "password": "string",
    "email": "string",
    "phoneNumber": "string",
    "fullName": "string",
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "department": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-31T12:46:01.385Z",
      "createdBy": "string",
      "updatedAt": "2026-05-31T12:46:01.385Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "active": true,
      "headOfDepartment": "string",
      "building": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.386Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.386Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true
      },
      "floor": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.386Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.386Z",
        "updatedBy": "string",
        "deleted": true,
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.386Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.386Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floorNumber": "string",
        "name": "string",
        "description": "string",
        "active": true
      },
      "location": "string",
      "contactNumber": "string",
      "email": "string",
      "totalBeds": 1073741824,
      "availableBeds": 1073741824
    },
    "building": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-31T12:46:01.386Z",
      "createdBy": "string",
      "updatedAt": "2026-05-31T12:46:01.386Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "active": true
    },
    "floor": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-31T12:46:01.386Z",
      "createdBy": "string",
      "updatedAt": "2026-05-31T12:46:01.386Z",
      "updatedBy": "string",
      "deleted": true,
      "building": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.386Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.386Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true
      },
      "floorNumber": "string",
      "name": "string",
      "description": "string",
      "active": true
    },
    "global": true,
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
  "assignedTo": {
    "id": 9007199254740991,
    "username": "string",
    "password": "string",
    "email": "string",
    "phoneNumber": "string",
    "fullName": "string",
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "department": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-31T12:46:01.387Z",
      "createdBy": "string",
      "updatedAt": "2026-05-31T12:46:01.387Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "active": true,
      "headOfDepartment": "string",
      "building": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.387Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.387Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true
      },
      "floor": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.387Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.387Z",
        "updatedBy": "string",
        "deleted": true,
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.387Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.387Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floorNumber": "string",
        "name": "string",
        "description": "string",
        "active": true
      },
      "location": "string",
      "contactNumber": "string",
      "email": "string",
      "totalBeds": 1073741824,
      "availableBeds": 1073741824
    },
    "building": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-31T12:46:01.388Z",
      "createdBy": "string",
      "updatedAt": "2026-05-31T12:46:01.388Z",
      "updatedBy": "string",
      "deleted": true,
      "name": "string",
      "code": "string",
      "description": "string",
      "active": true
    },
    "floor": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-31T12:46:01.388Z",
      "createdBy": "string",
      "updatedAt": "2026-05-31T12:46:01.388Z",
      "updatedBy": "string",
      "deleted": true,
      "building": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.388Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.388Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true
      },
      "floorNumber": "string",
      "name": "string",
      "description": "string",
      "active": true
    },
    "global": true,
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
  "resolution": "string"
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
    "createdAt": "2026-05-31T12:46:01.425Z",
    "createdBy": "string",
    "updatedAt": "2026-05-31T12:46:01.425Z",
    "updatedBy": "string",
    "deleted": true,
    "title": "string",
    "description": "string",
    "priority": "LOW",
    "status": "OPEN",
    "category": "IT_SUPPORT",
    "raisedBy": {
      "id": 9007199254740991,
      "username": "string",
      "password": "string",
      "email": "string",
      "phoneNumber": "string",
      "fullName": "string",
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.425Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.425Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true,
        "headOfDepartment": "string",
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.425Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.425Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floor": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.425Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.425Z",
          "updatedBy": "string",
          "deleted": true,
          "building": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-31T12:46:01.425Z",
            "createdBy": "string",
            "updatedAt": "2026-05-31T12:46:01.425Z",
            "updatedBy": "string",
            "deleted": true,
            "name": "string",
            "code": "string",
            "description": "string",
            "active": true
          },
          "floorNumber": "string",
          "name": "string",
          "description": "string",
          "active": true
        },
        "location": "string",
        "contactNumber": "string",
        "email": "string",
        "totalBeds": 1073741824,
        "availableBeds": 1073741824
      },
      "building": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.425Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.425Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true
      },
      "floor": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.425Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.425Z",
        "updatedBy": "string",
        "deleted": true,
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.425Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.425Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floorNumber": "string",
        "name": "string",
        "description": "string",
        "active": true
      },
      "global": true,
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
    "assignedTo": {
      "id": 9007199254740991,
      "username": "string",
      "password": "string",
      "email": "string",
      "phoneNumber": "string",
      "fullName": "string",
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.426Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.426Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true,
        "headOfDepartment": "string",
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.426Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.426Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floor": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.426Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.426Z",
          "updatedBy": "string",
          "deleted": true,
          "building": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-31T12:46:01.426Z",
            "createdBy": "string",
            "updatedAt": "2026-05-31T12:46:01.426Z",
            "updatedBy": "string",
            "deleted": true,
            "name": "string",
            "code": "string",
            "description": "string",
            "active": true
          },
          "floorNumber": "string",
          "name": "string",
          "description": "string",
          "active": true
        },
        "location": "string",
        "contactNumber": "string",
        "email": "string",
        "totalBeds": 1073741824,
        "availableBeds": 1073741824
      },
      "building": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.426Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.426Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true
      },
      "floor": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.426Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.426Z",
        "updatedBy": "string",
        "deleted": true,
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.426Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.426Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floorNumber": "string",
        "name": "string",
        "description": "string",
        "active": true
      },
      "global": true,
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
    "resolution": "string"
  },
  "timestamp": "2026-05-31T12:46:01.426Z"
}
No links

PATCH
/api/v1/helpdesk/tickets/{id}/assign
Assign ticket to staff


Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
userId *
integer($int64)
(query)
userId
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
    "createdAt": "2026-05-31T12:46:01.504Z",
    "createdBy": "string",
    "updatedAt": "2026-05-31T12:46:01.504Z",
    "updatedBy": "string",
    "deleted": true,
    "title": "string",
    "description": "string",
    "priority": "LOW",
    "status": "OPEN",
    "category": "IT_SUPPORT",
    "raisedBy": {
      "id": 9007199254740991,
      "username": "string",
      "password": "string",
      "email": "string",
      "phoneNumber": "string",
      "fullName": "string",
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.504Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.504Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true,
        "headOfDepartment": "string",
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.505Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.505Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floor": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.505Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.505Z",
          "updatedBy": "string",
          "deleted": true,
          "building": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-31T12:46:01.505Z",
            "createdBy": "string",
            "updatedAt": "2026-05-31T12:46:01.505Z",
            "updatedBy": "string",
            "deleted": true,
            "name": "string",
            "code": "string",
            "description": "string",
            "active": true
          },
          "floorNumber": "string",
          "name": "string",
          "description": "string",
          "active": true
        },
        "location": "string",
        "contactNumber": "string",
        "email": "string",
        "totalBeds": 1073741824,
        "availableBeds": 1073741824
      },
      "building": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.505Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.505Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true
      },
      "floor": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.505Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.505Z",
        "updatedBy": "string",
        "deleted": true,
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.505Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.505Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floorNumber": "string",
        "name": "string",
        "description": "string",
        "active": true
      },
      "global": true,
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
    "assignedTo": {
      "id": 9007199254740991,
      "username": "string",
      "password": "string",
      "email": "string",
      "phoneNumber": "string",
      "fullName": "string",
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.505Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.505Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true,
        "headOfDepartment": "string",
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.505Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.505Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floor": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.505Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.505Z",
          "updatedBy": "string",
          "deleted": true,
          "building": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-31T12:46:01.506Z",
            "createdBy": "string",
            "updatedAt": "2026-05-31T12:46:01.506Z",
            "updatedBy": "string",
            "deleted": true,
            "name": "string",
            "code": "string",
            "description": "string",
            "active": true
          },
          "floorNumber": "string",
          "name": "string",
          "description": "string",
          "active": true
        },
        "location": "string",
        "contactNumber": "string",
        "email": "string",
        "totalBeds": 1073741824,
        "availableBeds": 1073741824
      },
      "building": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.506Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.506Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true
      },
      "floor": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.506Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.506Z",
        "updatedBy": "string",
        "deleted": true,
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.506Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.506Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floorNumber": "string",
        "name": "string",
        "description": "string",
        "active": true
      },
      "global": true,
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
    "resolution": "string"
  },
  "timestamp": "2026-05-31T12:46:01.506Z"
}
No links

PATCH
/api/v1/helpdesk/tickets/{id}/resolve
Resolve ticket


Parameters
Try it out
Name	Description
id *
integer($int64)
(path)
id
resolution *
string
(query)
resolution
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
    "createdAt": "2026-05-31T12:46:01.561Z",
    "createdBy": "string",
    "updatedAt": "2026-05-31T12:46:01.561Z",
    "updatedBy": "string",
    "deleted": true,
    "title": "string",
    "description": "string",
    "priority": "LOW",
    "status": "OPEN",
    "category": "IT_SUPPORT",
    "raisedBy": {
      "id": 9007199254740991,
      "username": "string",
      "password": "string",
      "email": "string",
      "phoneNumber": "string",
      "fullName": "string",
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.561Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.561Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true,
        "headOfDepartment": "string",
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.561Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.561Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floor": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.561Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.561Z",
          "updatedBy": "string",
          "deleted": true,
          "building": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-31T12:46:01.561Z",
            "createdBy": "string",
            "updatedAt": "2026-05-31T12:46:01.561Z",
            "updatedBy": "string",
            "deleted": true,
            "name": "string",
            "code": "string",
            "description": "string",
            "active": true
          },
          "floorNumber": "string",
          "name": "string",
          "description": "string",
          "active": true
        },
        "location": "string",
        "contactNumber": "string",
        "email": "string",
        "totalBeds": 1073741824,
        "availableBeds": 1073741824
      },
      "building": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.561Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.561Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true
      },
      "floor": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.561Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.561Z",
        "updatedBy": "string",
        "deleted": true,
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.561Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.561Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floorNumber": "string",
        "name": "string",
        "description": "string",
        "active": true
      },
      "global": true,
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
    "assignedTo": {
      "id": 9007199254740991,
      "username": "string",
      "password": "string",
      "email": "string",
      "phoneNumber": "string",
      "fullName": "string",
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "department": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.562Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.562Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true,
        "headOfDepartment": "string",
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.562Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.562Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floor": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.562Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.562Z",
          "updatedBy": "string",
          "deleted": true,
          "building": {
            "id": 9007199254740991,
            "hospitalId": 9007199254740991,
            "branchId": 9007199254740991,
            "createdAt": "2026-05-31T12:46:01.562Z",
            "createdBy": "string",
            "updatedAt": "2026-05-31T12:46:01.562Z",
            "updatedBy": "string",
            "deleted": true,
            "name": "string",
            "code": "string",
            "description": "string",
            "active": true
          },
          "floorNumber": "string",
          "name": "string",
          "description": "string",
          "active": true
        },
        "location": "string",
        "contactNumber": "string",
        "email": "string",
        "totalBeds": 1073741824,
        "availableBeds": 1073741824
      },
      "building": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.562Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.562Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "code": "string",
        "description": "string",
        "active": true
      },
      "floor": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-31T12:46:01.562Z",
        "createdBy": "string",
        "updatedAt": "2026-05-31T12:46:01.562Z",
        "updatedBy": "string",
        "deleted": true,
        "building": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-31T12:46:01.562Z",
          "createdBy": "string",
          "updatedAt": "2026-05-31T12:46:01.562Z",
          "updatedBy": "string",
          "deleted": true,
          "name": "string",
          "code": "string",
          "description": "string",
          "active": true
        },
        "floorNumber": "string",
        "name": "string",
        "description": "string",
        "active": true
      },
      "global": true,
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
    "resolution": "string"
  },
  "timestamp": "2026-05-31T12:46:01.562Z"
}