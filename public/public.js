/***********
** AJAX Requests
************/

// Add update and delete functionality to each item
let itemIDs = document.querySelectorAll("#itemID");
let deleteBtns = document.querySelectorAll("#itemDelete");
let updateBtns = document.querySelectorAll("#itemUpdate");

itemIDs.forEach(function(itemID, i) {
    deleteBtns[i].addEventListener("click", function() {
        deleteItem(itemID.textContent);
    });
    
    updateBtns[i].setAttribute("onclick", `window.location.href = '/updateItem?id=${itemID.textContent}'`);
});


// add update and delete to each customer
let customerIDs = document.querySelectorAll("#customerID");
let custDeleteBtn = document.querySelectorAll("#customerDelete");
let custUpdateBtn = document.querySelectorAll("#customerUpdate");

customerIDs.forEach(function(customerID, i) {
    custDeleteBtn[i].addEventListener("click", function() {
        deleteCustomer(customerID.textContent);
    });

    custUpdateBtn[i].setAttribute("onclick", `window.location.href = '/updateCustomer?id=${customerID.textContent}'`);
})


// add update and delete to each vendor
let vendorIDs = document.querySelectorAll("#vendorID");
let vendorDeleteBtn = document.querySelectorAll("#vendorDelete");
let vendorUpdateBtn = document.querySelectorAll("#vendorUpdate");

vendorIDs.forEach(function(vendorID, i) {
    vendorDeleteBtn[i].addEventListener("click", function() {
        deleteVendor(vendorID.textContent);
    });

    vendorUpdateBtn[i].setAttribute("onclick", `window.location.href = '/updateVendor?id=${vendorID.textContent}'`);
})



function deleteItem(itemID) {
    //alert("This item ID is: " + itemID);

    let req = new XMLHttpRequest();

    req.open("DELETE", `/admin?type=item&id=${itemID}`, false);

    req.addEventListener("load", function() {
        if (req.status >= 200 && req.status < 400 && req.responseText == "OK")
        {
            location.reload();
        }
        else 
        {
            alert("Error is request: " + req.statusText);
        }
    })

    req.send();
}


function deleteCustomer(customerID) {
    //alert("This item ID is: " + itemID);

    let req = new XMLHttpRequest();

    req.open("DELETE", `/admin?type=customer&id=${customerID}`, false);

    req.addEventListener("load", function() {
        if (req.status >= 200 && req.status < 400 && req.responseText == "OK")
        {
            location.reload();
        }
        else 
        {
            alert("Error in request: " + req.statusText);
        }
    })

    req.send();
}

function deleteVendor(vendorID) {

    let req = new XMLHttpRequest();

    req.open("DELETE", `/admin?type=vendor&id=${vendorID}`, false);

    req.addEventListener("load", function() {
        if (req.status >= 200 && req.status < 400 && req.responseText == "OK")
        {
            location.reload();
        }
        else if (req.status >= 200 && req.status < 400 && req.responseText == "INVALID DELETE") 
        {
            alert("Cannot delete vendor with existing items");
        }
        else
        {
            alert("Error: " + req.statusText);
        }
    })

    req.send();
}