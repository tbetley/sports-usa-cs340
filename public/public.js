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

customerIDs.forEach(function(customerID, i) {
    custDeleteBtn[i].addEventListener("click", function() {
        deleteCustomer(customerID.textContent);
    })
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


function updateItem(itemID) {
    // alert("this item id is: " + itemID);
    let req = new XMLHttpRequest();

    req.open("POST", `/update?`)
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
            alert("Error is request: " + req.statusText);
        }
    })

    req.send();
}