// ===============================
// Sample Customer Data
// ===============================

const customers = {

    "ABC Company": {
        information: "ABC Company is a technology company. Contact person: Ravi Kumar.",
        discussion: "Discussed product pricing and reporting requirements.",
        requirements: "Customer needs advanced reporting and dashboard features.",
        followups: "Send pricing document and product demo details.",
        topics: "1. Product pricing<br>2. Reporting features<br>3. Product demo"
    },

    "XYZ Technologies": {
        information: "XYZ Technologies is a software company. Contact person: Priya Sharma.",
        discussion: "Discussed software integration and customer support.",
        requirements: "Customer needs API integration and faster support.",
        followups: "Share API documentation and support plan.",
        topics: "1. API integration<br>2. Support plan<br>3. Implementation timeline"
    },

    "Global Solutions": {
        information: "Global Solutions provides business solutions. Contact person: Arjun Reddy.",
        discussion: "Discussed business automation and pricing.",
        requirements: "Customer needs workflow automation and customized pricing.",
        followups: "Prepare automation proposal and customized quotation.",
        topics: "1. Automation proposal<br>2. Customized pricing<br>3. Project timeline"
    }

};


// ===============================
// Prepare Meeting
// ===============================

function prepareMeeting() {

    let customer = document.getElementById("customerName").value;

    if (customer === "") {
        alert("Please select a customer.");
        return;
    }

    let data = customers[customer];

    // If customer came from MongoDB
    // but is not present in local object
    if (!data) {

        alert("Customer information is not available yet.");
        return;
    }

    document.getElementById("meetingResult").style.display = "block";

    document.getElementById("customerInfo").innerHTML =
        data.information;

    document.getElementById("previousDiscussion").innerHTML =
        data.discussion;

    document.getElementById("requirements").innerHTML =
        data.requirements;

    document.getElementById("followups").innerHTML =
        data.followups;

    document.getElementById("topics").innerHTML =
        data.topics;
}


// ===============================
// Add New Customer
// ===============================

async function addCustomer() {

    let name =
        document.getElementById("newCustomer").value;

    let discussion =
        document.getElementById("newDiscussion").value;

    let requirement =
        document.getElementById("newRequirement").value;

    let followup =
        document.getElementById("newFollowup").value;

    let topics =
        document.getElementById("newTopics").value;


    // Check customer name
    if (name === "") {

        alert("Please enter customer name.");
        return;
    }


    try {

        // Send customer data to backend
        const response = await fetch(
            "http://localhost:3000/api/meetings",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    customerName: name,

                    discussion: discussion,

                    requirements: requirement,

                    followups: followup,

                    topics: topics

                })
            }
        );


        const result = await response.json();


        // Check backend response
        if (!response.ok) {

            alert(
                "Error: " +
                (result.message || "Could not add customer")
            );

            return;
        }


        // Also store customer in browser object
        customers[name] = {

            information:
                name + " customer.",

            discussion:
                discussion,

            requirements:
                requirement,

            followups:
                followup,

            topics:
                topics
        };


        // Add customer to dropdown
        let dropdown =
            document.getElementById("customerName");


        let option =
            document.createElement("option");


        option.value = name;

        option.textContent = name;


        dropdown.appendChild(option);


        alert("Customer added successfully!");


        // Clear input fields
        document.getElementById("newCustomer").value = "";

        document.getElementById("newDiscussion").value = "";

        document.getElementById("newRequirement").value = "";

        document.getElementById("newFollowup").value = "";

        document.getElementById("newTopics").value = "";


    } catch (error) {

        console.error(
            "Error adding customer:",
            error
        );

        alert(
            "Cannot connect to backend. Make sure server.js is running."
        );
    }
}


// ===============================
// Load Customers From MongoDB
// ===============================

async function loadCustomers() {

    try {

        const response =
            await fetch(
                "http://localhost:3000/api/meetings"
            );


        const meetings =
            await response.json();


        const dropdown =
            document.getElementById("customerName");


        meetings.forEach(meeting => {

            // Avoid duplicate customers
            let alreadyExists =
                [...dropdown.options].some(
                    option =>
                        option.value ===
                        meeting.customerName
                );


            if (!alreadyExists) {

                let option =
                    document.createElement("option");


                option.value =
                    meeting.customerName;


                option.textContent =
                    meeting.customerName;


                dropdown.appendChild(option);
            }


            // Add MongoDB customer to local object
            customers[meeting.customerName] = {

                information:
                    meeting.customerName +
                    " customer.",

                discussion:
                    meeting.discussion || "",

                requirements:
                    meeting.requirements || "",

                followups:
                    meeting.followups || "",

                topics:
                    meeting.topics || ""
            };

        });


    } catch (error) {

        console.error(
            "Error loading customers:",
            error
        );
    }
}


// ===============================
// Load Customers When Page Opens
// ===============================

loadCustomers();