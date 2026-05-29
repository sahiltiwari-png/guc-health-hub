Pharmacy
GET
/api/v1/inventory/pharmacy/dashboard
Pharmacy Dashboard Stats


Retrieves key metrics for pharmacy dashboard

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
  "timestamp": "2026-05-29T03:00:34.503Z"
}

GET
/api/v1/inventory/pharmacy/dispense
List dispenses


Retrieves all pharmacy dispense records

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
        "createdAt": "2026-05-29T02:53:55.639Z",
        "createdBy": "string",
        "updatedAt": "2026-05-29T02:53:55.639Z",
        "updatedBy": "string",
        "deleted": true,
        "patient": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-29T02:53:55.639Z",
          "createdBy": "string",
          "updatedAt": "2026-05-29T02:53:55.639Z",
          "updatedBy": "string",
          "deleted": true,
          "firstName": "string",
          "lastName": "string",
          "gender": "string",
          "dateOfBirth": "2026-05-29",
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
        "patientName": "string",
        "dispenseNumber": "string",
        "dispenseDate": "2026-05-29T02:53:55.639Z",
        "totalAmount": 0.1,
        "prescriptionId": "string",
        "status": "string",
        "items": [
          {
            "id": 9007199254740991,
            "pharmacyDispense": "string",
            "stock": {
              "id": 9007199254740991,
              "hospitalId": 9007199254740991,
              "branchId": 9007199254740991,
              "createdAt": "2026-05-29T02:53:55.639Z",
              "createdBy": "string",
              "updatedAt": "2026-05-29T02:53:55.639Z",
              "updatedBy": "string",
              "deleted": true,
              "medicineName": "string",
              "batchNumber": "string",
              "genericName": "string",
              "manufacturer": "string",
              "unitPrice": 0.1,
              "mrp": 0.1,
              "quantity": 1073741824,
              "expiryDate": "2026-05-29",
              "reorderLevel": 1073741824,
              "active": true,
              "category": "string"
            },
            "quantity": 1073741824,
            "unitPrice": 0.1,
            "totalAmount": 0.1
          }
        ]
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
      "pageSize": 1073741824,
      "pageNumber": 1073741824,
      "paged": true,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2026-05-29T02:53:55.639Z"
}
No links

POST
/api/v1/inventory/pharmacy/dispense
Dispense medicine


Records a new medicine dispense and reduces stock

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
  "createdAt": "2026-05-29T02:53:55.647Z",
  "createdBy": "string",
  "updatedAt": "2026-05-29T02:53:55.647Z",
  "updatedBy": "string",
  "deleted": true,
  "patient": {
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-29T02:53:55.647Z",
    "createdBy": "string",
    "updatedAt": "2026-05-29T02:53:55.647Z",
    "updatedBy": "string",
    "deleted": true,
    "firstName": "string",
    "lastName": "string",
    "gender": "string",
    "dateOfBirth": "2026-05-29",
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
  "patientName": "string",
  "dispenseNumber": "string",
  "dispenseDate": "2026-05-29T02:53:55.647Z",
  "totalAmount": 0.1,
  "prescriptionId": "string",
  "status": "string",
  "items": [
    {
      "id": 9007199254740991,
      "pharmacyDispense": "string",
      "stock": {
        "id": 9007199254740991,
        "hospitalId": 9007199254740991,
        "branchId": 9007199254740991,
        "createdAt": "2026-05-29T02:53:55.647Z",
        "createdBy": "string",
        "updatedAt": "2026-05-29T02:53:55.647Z",
        "updatedBy": "string",
        "deleted": true,
        "medicineName": "string",
        "batchNumber": "string",
        "genericName": "string",
        "manufacturer": "string",
        "unitPrice": 0.1,
        "mrp": 0.1,
        "quantity": 1073741824,
        "expiryDate": "2026-05-29",
        "reorderLevel": 1073741824,
        "active": true,
        "category": "string"
      },
      "quantity": 1073741824,
      "unitPrice": 0.1,
      "totalAmount": 0.1
    }
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
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-29T02:53:55.649Z",
    "createdBy": "string",
    "updatedAt": "2026-05-29T02:53:55.649Z",
    "updatedBy": "string",
    "deleted": true,
    "patient": {
      "id": 9007199254740991,
      "hospitalId": 9007199254740991,
      "branchId": 9007199254740991,
      "createdAt": "2026-05-29T02:53:55.649Z",
      "createdBy": "string",
      "updatedAt": "2026-05-29T02:53:55.649Z",
      "updatedBy": "string",
      "deleted": true,
      "firstName": "string",
      "lastName": "string",
      "gender": "string",
      "dateOfBirth": "2026-05-29",
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
    "patientName": "string",
    "dispenseNumber": "string",
    "dispenseDate": "2026-05-29T02:53:55.649Z",
    "totalAmount": 0.1,
    "prescriptionId": "string",
    "status": "string",
    "items": [
      {
        "id": 9007199254740991,
        "pharmacyDispense": "string",
        "stock": {
          "id": 9007199254740991,
          "hospitalId": 9007199254740991,
          "branchId": 9007199254740991,
          "createdAt": "2026-05-29T02:53:55.649Z",
          "createdBy": "string",
          "updatedAt": "2026-05-29T02:53:55.649Z",
          "updatedBy": "string",
          "deleted": true,
          "medicineName": "string",
          "batchNumber": "string",
          "genericName": "string",
          "manufacturer": "string",
          "unitPrice": 0.1,
          "mrp": 0.1,
          "quantity": 1073741824,
          "expiryDate": "2026-05-29",
          "reorderLevel": 1073741824,
          "active": true,
          "category": "string"
        },
        "quantity": 1073741824,
        "unitPrice": 0.1,
        "totalAmount": 0.1
      }
    ]
  },
  "timestamp": "2026-05-29T02:53:55.649Z"
}
No links

GET
/api/v1/inventory/pharmacy/stock
Method Summary


Retrieves all items currently in the pharmacy inventory

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
        "createdAt": "2026-05-29T02:53:55.653Z",
        "createdBy": "string",
        "updatedAt": "2026-05-29T02:53:55.653Z",
        "updatedBy": "string",
        "deleted": true,
        "medicineName": "string",
        "batchNumber": "string",
        "genericName": "string",
        "manufacturer": "string",
        "unitPrice": 0.1,
        "mrp": 0.1,
        "quantity": 1073741824,
        "expiryDate": "2026-05-29",
        "reorderLevel": 1073741824,
        "active": true,
        "category": "string"
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
      "pageSize": 1073741824,
      "pageNumber": 1073741824,
      "paged": true,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2026-05-29T02:53:55.653Z"
}
No links

POST
/api/v1/inventory/pharmacy/stock
Add pharmacy stock


Registers new stock items in the hospital pharmacy

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
  "createdAt": "2026-05-29T02:53:55.656Z",
  "createdBy": "string",
  "updatedAt": "2026-05-29T02:53:55.656Z",
  "updatedBy": "string",
  "deleted": true,
  "medicineName": "string",
  "batchNumber": "string",
  "genericName": "string",
  "manufacturer": "string",
  "unitPrice": 0.1,
  "mrp": 0.1,
  "quantity": 1073741824,
  "expiryDate": "2026-05-29",
  "reorderLevel": 1073741824,
  "active": true,
  "category": "string"
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
    "createdAt": "2026-05-29T02:53:55.657Z",
    "createdBy": "string",
    "updatedAt": "2026-05-29T02:53:55.657Z",
    "updatedBy": "string",
    "deleted": true,
    "medicineName": "string",
    "batchNumber": "string",
    "genericName": "string",
    "manufacturer": "string",
    "unitPrice": 0.1,
    "mrp": 0.1,
    "quantity": 1073741824,
    "expiryDate": "2026-05-29",
    "reorderLevel": 1073741824,
    "active": true,
    "category": "string"
  },
  "timestamp": "2026-05-29T02:53:55.657Z"
}
No links

PUT
/api/v1/inventory/pharmacy/stock/{id}
Update pharmacy stock


Updates an existing stock item's details

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
  "createdAt": "2026-05-29T02:53:55.659Z",
  "createdBy": "string",
  "updatedAt": "2026-05-29T02:53:55.659Z",
  "updatedBy": "string",
  "deleted": true,
  "medicineName": "string",
  "batchNumber": "string",
  "genericName": "string",
  "manufacturer": "string",
  "unitPrice": 0.1,
  "mrp": 0.1,
  "quantity": 1073741824,
  "expiryDate": "2026-05-29",
  "reorderLevel": 1073741824,
  "active": true,
  "category": "string"
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
    "createdAt": "2026-05-29T02:53:55.660Z",
    "createdBy": "string",
    "updatedAt": "2026-05-29T02:53:55.660Z",
    "updatedBy": "string",
    "deleted": true,
    "medicineName": "string",
    "batchNumber": "string",
    "genericName": "string",
    "manufacturer": "string",
    "unitPrice": 0.1,
    "mrp": 0.1,
    "quantity": 1073741824,
    "expiryDate": "2026-05-29",
    "reorderLevel": 1073741824,
    "active": true,
    "category": "string"
  },
  "timestamp": "2026-05-29T02:53:55.660Z"
}
No links

DELETE
/api/v1/inventory/pharmacy/stock/{id}
Method Summary


Removes a stock item from the pharmacy inventory

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
  "timestamp": "2026-05-29T02:53:55.661Z"
}
No links

GET
/api/v1/inventory/pharmacy/stock/search
Search pharmacy stock


Filters pharmacy stock by name, generic name, and batch number

Parameters
Try it out
Name	Description
name
string
(query)
name
genericName
string
(query)
genericName
batchNumber
string
(query)
batchNumber
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
        "createdAt": "2026-05-29T02:53:55.664Z",
        "createdBy": "string",
        "updatedAt": "2026-05-29T02:53:55.664Z",
        "updatedBy": "string",
        "deleted": true,
        "medicineName": "string",
        "batchNumber": "string",
        "genericName": "string",
        "manufacturer": "string",
        "unitPrice": 0.1,
        "mrp": 0.1,
        "quantity": 1073741824,
        "expiryDate": "2026-05-29",
        "reorderLevel": 1073741824,
        "active": true,
        "category": "string"
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
      "pageSize": 1073741824,
      "pageNumber": 1073741824,
      "paged": true,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2026-05-29T02:53:55.664Z"
}
No links

GET
/api/v1/inventory/purchase-orders
List Purchase Orders


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
        "createdAt": "2026-05-29T02:53:55.666Z",
        "createdBy": "string",
        "updatedAt": "2026-05-29T02:53:55.666Z",
        "updatedBy": "string",
        "deleted": true,
        "poNumber": "string",
        "orderDate": "2026-05-29",
        "supplierName": "string",
        "totalAmount": 0.1,
        "status": "DRAFT",
        "termsAndConditions": "string",
        "items": [
          {
            "id": 9007199254740991,
            "purchaseOrder": "string",
            "itemName": "string",
            "unitPrice": 0.1,
            "quantity": 0.1,
            "totalAmount": 0.1,
            "itemId": 9007199254740991
          }
        ]
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
      "pageSize": 1073741824,
      "pageNumber": 1073741824,
      "paged": true,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2026-05-29T02:53:55.666Z"
}
No links

POST
/api/v1/inventory/purchase-orders
Create Purchase Order


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
  "createdAt": "2026-05-29T02:53:55.669Z",
  "createdBy": "string",
  "updatedAt": "2026-05-29T02:53:55.669Z",
  "updatedBy": "string",
  "deleted": true,
  "poNumber": "string",
  "orderDate": "2026-05-29",
  "supplierName": "string",
  "totalAmount": 0.1,
  "status": "DRAFT",
  "termsAndConditions": "string",
  "items": [
    {
      "id": 9007199254740991,
      "purchaseOrder": "string",
      "itemName": "string",
      "unitPrice": 0.1,
      "quantity": 0.1,
      "totalAmount": 0.1,
      "itemId": 9007199254740991
    }
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
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-29T02:53:55.669Z",
    "createdBy": "string",
    "updatedAt": "2026-05-29T02:53:55.669Z",
    "updatedBy": "string",
    "deleted": true,
    "poNumber": "string",
    "orderDate": "2026-05-29",
    "supplierName": "string",
    "totalAmount": 0.1,
    "status": "DRAFT",
    "termsAndConditions": "string",
    "items": [
      {
        "id": 9007199254740991,
        "purchaseOrder": "string",
        "itemName": "string",
        "unitPrice": 0.1,
        "quantity": 0.1,
        "totalAmount": 0.1,
        "itemId": 9007199254740991
      }
    ]
  },
  "timestamp": "2026-05-29T02:53:55.669Z"
}
No links

POST
/api/v1/inventory/purchase-orders/{id}/receive
Receive Purchase Order


Marks PO as received and increases pharmacy stock

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
    "createdAt": "2026-05-29T02:53:55.671Z",
    "createdBy": "string",
    "updatedAt": "2026-05-29T02:53:55.671Z",
    "updatedBy": "string",
    "deleted": true,
    "poNumber": "string",
    "orderDate": "2026-05-29",
    "supplierName": "string",
    "totalAmount": 0.1,
    "status": "DRAFT",
    "termsAndConditions": "string",
    "items": [
      {
        "id": 9007199254740991,
        "purchaseOrder": "string",
        "itemName": "string",
        "unitPrice": 0.1,
        "quantity": 0.1,
        "totalAmount": 0.1,
        "itemId": 9007199254740991
      }
    ]
  },
  "timestamp": "2026-05-29T02:53:55.671Z"
}
No links

GET
/api/v1/inventory/suppliers
List suppliers


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
        "createdAt": "2026-05-29T02:53:55.675Z",
        "createdBy": "string",
        "updatedAt": "2026-05-29T02:53:55.675Z",
        "updatedBy": "string",
        "deleted": true,
        "name": "string",
        "supplierCode": "string",
        "contactPerson": "string",
        "phone": "string",
        "email": "string",
        "address": "string",
        "tinNumber": "string",
        "bankDetails": "string",
        "active": true
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
      "pageSize": 1073741824,
      "pageNumber": 1073741824,
      "paged": true,
      "unpaged": true
    },
    "empty": true
  },
  "timestamp": "2026-05-29T02:53:55.675Z"
}
No links

POST
/api/v1/inventory/suppliers
Add supplier


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
  "createdAt": "2026-05-29T02:53:55.678Z",
  "createdBy": "string",
  "updatedAt": "2026-05-29T02:53:55.678Z",
  "updatedBy": "string",
  "deleted": true,
  "name": "string",
  "supplierCode": "string",
  "contactPerson": "string",
  "phone": "string",
  "email": "string",
  "address": "string",
  "tinNumber": "string",
  "bankDetails": "string",
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
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-29T02:53:55.679Z",
    "createdBy": "string",
    "updatedAt": "2026-05-29T02:53:55.679Z",
    "updatedBy": "string",
    "deleted": true,
    "name": "string",
    "supplierCode": "string",
    "contactPerson": "string",
    "phone": "string",
    "email": "string",
    "address": "string",
    "tinNumber": "string",
    "bankDetails": "string",
    "active": true
  },
  "timestamp": "2026-05-29T02:53:55.679Z"
}
No links

PUT
/api/v1/inventory/suppliers/{id}
Update supplier


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
  "createdAt": "2026-05-29T02:53:55.681Z",
  "createdBy": "string",
  "updatedAt": "2026-05-29T02:53:55.681Z",
  "updatedBy": "string",
  "deleted": true,
  "name": "string",
  "supplierCode": "string",
  "contactPerson": "string",
  "phone": "string",
  "email": "string",
  "address": "string",
  "tinNumber": "string",
  "bankDetails": "string",
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
    "id": 9007199254740991,
    "hospitalId": 9007199254740991,
    "branchId": 9007199254740991,
    "createdAt": "2026-05-29T02:53:55.682Z",
    "createdBy": "string",
    "updatedAt": "2026-05-29T02:53:55.682Z",
    "updatedBy": "string",
    "deleted": true,
    "name": "string",
    "supplierCode": "string",
    "contactPerson": "string",
    "phone": "string",
    "email": "string",
    "address": "string",
    "tinNumber": "string",
    "bankDetails": "string",
    "active": true
  },
  "timestamp": "2026-05-29T02:53:55.682Z"
}
No links

GET
/api/v1/pharmacy/dispenses
Frontend pharmacy dispense feed


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
  "timestamp": "2026-05-29T02:53:55.683Z"
}
No links

GET
/api/v1/pharmacy/inventory
Frontend pharmacy inventory feed


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
Default value : 50

50
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
  "timestamp": "2026-05-29T02:53:55.685Z"
}