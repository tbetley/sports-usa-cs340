/***********
** AJAX Requests
************/

// Create delete listener on each delete button
let itemIDs = document.querySelectorAll("#itemID");
let deleteBtns = document.querySelectorAll("#delete");

itemIDs.forEach(function(itemID, i) {
    deleteBtns[i].addEventListener("click", function() {
        deleteItem(itemID.textContent);
    });
});

function deleteItem(itemID) {
    //alert("This item ID is: " + itemID);

    let req = new XMLHttpRequest();

    req.open("DELETE", `/admin?id=${itemID}`, false);

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