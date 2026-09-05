/* =========================================
   HOME CAR WASH SYSTEM
   ========================================= */

const BOOKING_KEY = "homeCarWashBooking";
const PROFILE_KEY = "homeCarWashProfile";
const PAYMENT_KEY = "homeCarWashPayments";

const statuses = [
    "Accepted",
    "On the Way",
    "Arrived",
    "Washing",
    "Completed"
];


/* =========================================
   BASIC FUNCTIONS
   ========================================= */

function getBooking() {

    const data =
        localStorage.getItem(BOOKING_KEY);

    if (!data) {
        return null;
    }

    return JSON.parse(data);
}


function saveBooking(booking) {

    localStorage.setItem(
        BOOKING_KEY,
        JSON.stringify(booking)
    );
}


function money(amount) {

    return "RM " +
        Number(amount).toFixed(2);
}


function toast(message) {

    alert(message);
}


/* =========================================
   QUICK BOOKING
   ========================================= */

function quickBook(packageName) {

    localStorage.setItem(
        "quickPackage",
        packageName
    );

    window.location.href =
        "Booking.html";
}


/* =========================================
   LOGIN
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const loginForm =
            document.getElementById(
                "loginForm"
            );

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    const email =
                        document.getElementById(
                            "loginEmail"
                        ).value;

                    localStorage.setItem(
                        "customerEmail",
                        email
                    );

                    toast(
                        "Login successful!"
                    );

                    setTimeout(
                        function () {

                            window.location.href =
                                "Booking.html";

                        },
                        500
                    );

                }
            );

        }


        initializeBooking();

        initializePayment();

        initializeProfile();

        initializeTracking();

    }
);


/* =========================================
   BOOKING PAGE
   ========================================= */

function initializeBooking() {

    const form =
        document.getElementById(
            "bookingForm"
        );

    if (!form) {
        return;
    }


    /* Prevent past dates */

    const dateInput =
        document.getElementById("date");

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    dateInput.min = today;


    /* Quick package */

    const quick =
        localStorage.getItem(
            "quickPackage"
        );

    if (quick) {

        const packageInputs =
            document.querySelectorAll(
                'input[name="package"]'
            );

        packageInputs.forEach(
            function (input) {

                if (
                    input.value === quick
                ) {

                    input.checked = true;

                }

            }
        );

        localStorage.removeItem(
            "quickPackage"
        );
    }


    /* Update price */

    document.querySelectorAll(
        'input[name="package"]'
    ).forEach(
        function (input) {

            input.addEventListener(
                "change",
                updateSummary
            );

        }
    );


    document.getElementById(
        "carType"
    ).addEventListener(
        "change",
        updateSummary
    );


    updateSummary();


    /* Submit booking */

    form.addEventListener(
        "submit",
        createBooking
    );

}


/* =========================================
   CALCULATE PRICE
   ========================================= */

function calculatePrice() {

    const packageInput =
        document.querySelector(
            'input[name="package"]:checked'
        );

    let price =
        Number(
            packageInput.dataset.price
        );


    const carType =
        document.getElementById(
            "carType"
        ).value;


    if (carType === "SUV") {

        price += 10;

    }


    if (carType === "MPV") {

        price += 15;

    }


    return price;
}


/* =========================================
   UPDATE SUMMARY
   ========================================= */

function updateSummary() {

    const summary =
        document.getElementById(
            "summary"
        );

    if (!summary) {
        return;
    }


    const packageInput =
        document.querySelector(
            'input[name="package"]:checked'
        );


    const packageName =
        packageInput.value;


    const carType =
        document.getElementById(
            "carType"
        ).value;


    const date =
        document.getElementById(
            "date"
        ).value;


    const time =
        document.getElementById(
            "time"
        ).value;


    const price =
        calculatePrice();


    summary.innerHTML = `

        <div class="service-row">
            <span>Car</span>
            <b>${carType}</b>
        </div>

        <div class="service-row">
            <span>Package</span>
            <b>${packageName}</b>
        </div>

        <div class="service-row">
            <span>Date</span>
            <b>
                ${date || "Not selected"}
            </b>
        </div>

        <div class="service-row">
            <span>Time</span>
            <b>${time}</b>
        </div>

    `;


    document.getElementById(
        "total"
    ).textContent =
        money(price);
}


/* =========================================
   LOCATION
   ========================================= */

function useLocation() {

    if (
        !navigator.geolocation
    ) {

        toast(
            "Location is not supported."
        );

        return;
    }


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude
                    .toFixed(5);

            const longitude =
                position.coords.longitude
                    .toFixed(5);


            document.getElementById(
                "address"
            ).value =
                `Current location:
Latitude ${latitude},
Longitude ${longitude}`;


            toast(
                "Your location has been added."
            );

        },

        function () {

            toast(
                "Unable to access your location."
            );

        }

    );

}


/* =========================================
   CREATE BOOKING
   ========================================= */

function createBooking(event) {

    event.preventDefault();


    const packageInput =
        document.querySelector(
            'input[name="package"]:checked'
        );


    const paymentMethod =
        document.querySelector(
            'input[name="pay"]:checked'
        ).value;


    const booking = {

        id:
            "HCW-" +
            Date.now()
                .toString()
                .slice(-6),

        car:
            document.getElementById(
                "carType"
            ).value,

        plate:
            document.getElementById(
                "plate"
            ).value.toUpperCase(),

        package:
            packageInput.value,

        date:
            document.getElementById(
                "date"
            ).value,

        time:
            document.getElementById(
                "time"
            ).value,

        address:
            document.getElementById(
                "address"
            ).value,

        payment:
            paymentMethod,

        total:
            calculatePrice(),

        status: 0,

        washer:
            "Ahmad",

        created:
            new Date().toLocaleString()

    };


    saveBooking(booking);


    toast(
        "Booking confirmed successfully!"
    );


    setTimeout(
        function () {

            if (
                paymentMethod === "Online"
            ) {

                window.location.href =
                    "Payment.html";

            } else {

                window.location.href =
                    "Wash Tracking.html";

            }

        },
        700
    );

}


/* =========================================
   TRACKING
   ========================================= */

function initializeTracking() {

    const progress =
        document.getElementById(
            "progress"
        );

    if (!progress) {
        return;
    }


    renderTracking();

}


function renderTracking() {

    const booking =
        getBooking();


    if (!booking) {

        document.getElementById(
            "trackBooking"
        ).textContent =
            "No booking found. Please create a booking first.";

        return;
    }


    document.getElementById(
        "trackBooking"
    ).textContent =
        `Booking ${booking.id}
        • ${booking.package}
        • ${booking.date}
        • ${booking.time}`;


    document.getElementById(
        "washerName"
    ).textContent =
        booking.washer;


    document.getElementById(
        "statusPill"
    ).textContent =
        statuses[booking.status];


    const progress =
        document.getElementById(
            "progress"
        );


    progress.innerHTML =
        statuses.map(
            function (status, index) {

                let className = "";


                if (
                    index < booking.status
                ) {

                    className = "done";

                }


                if (
                    index === booking.status
                ) {

                    className =
                        "current";

                }


                return `

                    <div
                        class="pstep ${className}"
                    >

                        <div class="dot">

                            ${
                                index <
                                booking.status
                                ? "✓"
                                : index + 1
                            }

                        </div>

                        ${status}

                    </div>

                `;

            }
        ).join("");


    document.getElementById(
        "serviceDetails"
    ).innerHTML = `

        <div class="service-row">
            <span>Booking ID</span>
            <b>${booking.id}</b>
        </div>

        <div class="service-row">
            <span>Car</span>
            <b>
                ${booking.car}
                -
                ${booking.plate}
            </b>
        </div>

        <div class="service-row">
            <span>Package</span>
            <b>${booking.package}</b>
        </div>

        <div class="service-row">
            <span>Total</span>
            <b>${money(booking.total)}</b>
        </div>

        <div class="service-row">
            <span>Payment</span>
            <b>${booking.payment}</b>
        </div>

    `;

}


/* =========================================
   CHANGE WASHER STATUS
   ========================================= */

function nextStatus() {

    const booking =
        getBooking();


    if (!booking) {

        toast(
            "No booking found."
        );

        return;
    }


    if (
        booking.status <
        statuses.length - 1
    ) {

        booking.status++;

    }


    saveBooking(booking);

    renderTracking();


    toast(
        "Status updated to: " +
        statuses[booking.status]
    );

}


/* =========================================
   COMPLETE WASH
   ========================================= */

function completeWash() {

    const booking =
        getBooking();


    if (!booking) {
        return;
    }


    booking.status = 4;

    saveBooking(booking);

    renderTracking();


    toast(
        "Wash completed! Customer has been notified."
    );

}


/* =========================================
   NAVIGATION
   ========================================= */

function navigateToCustomer() {

    const booking =
        getBooking();


    if (!booking) {
        return;
    }


    const address =
        encodeURIComponent(
            booking.address
        );


    window.open(
        "https://www.google.com/maps/search/?api=1&query=" +
        address,
        "_blank"
    );

}


/* =========================================
   CONTACT WASHER
   ========================================= */

function contactWasher() {

    toast(
        "Washer Ahmad: +60 12-345 6789"
    );

}


/* =========================================
   PAYMENT
   ========================================= */

function initializePayment() {

    const paymentBox =
        document.getElementById(
            "paymentBox"
        );


    if (!paymentBox) {
        return;
    }


    const booking =
        getBooking();


    if (!booking) {

        paymentBox.innerHTML = `

            <p class="history-empty">
                No booking available.
            </p>

        `;

        return;
    }


    paymentBox.innerHTML = `

        <div class="receipt">

            <h3>
                ${booking.package}
            </h3>

            <p>
                ${booking.car}
                •
                ${booking.plate}
            </p>

            <p>
                ${booking.date}
                •
                ${booking.time}
            </p>

            <h2>
                ${money(booking.total)}
            </h2>

            <small>
                Booking:
                ${booking.id}
            </small>

        </div>

    `;


    renderPaymentHistory();


    const form =
        document.getElementById(
            "paymentForm"
        );


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const method =
                document.getElementById(
                    "paymentMethod"
                ).value;


            const payments =
                JSON.parse(
                    localStorage.getItem(
                        PAYMENT_KEY
                    ) || "[]"
                );


            payments.unshift({

                id:
                    booking.id,

                amount:
                    booking.total,

                method:
                    method,

                date:
                    new Date()
                        .toLocaleDateString()

            });


            localStorage.setItem(
                PAYMENT_KEY,
                JSON.stringify(payments)
            );


            toast(
                "Payment successful! Digital receipt generated."
            );


            setTimeout(
                function () {

                    window.location.href =
                        "Wash Tracking.html";

                },
                700
            );

        }
    );

}


/* =========================================
   PAYMENT HISTORY
   ========================================= */

function renderPaymentHistory() {

    const history =
        document.getElementById(
            "history"
        );


    if (!history) {
        return;
    }


    const payments =
        JSON.parse(
            localStorage.getItem(
                PAYMENT_KEY
            ) || "[]"
        );


    if (
        payments.length === 0
    ) {

        history.innerHTML = `

            <p>
                No payment history yet.
            </p>

        `;

        return;
    }


    history.innerHTML =
        payments.map(
            function (payment) {

                return `

                    <div class="history-row">

                        <span>

                            ${payment.date}

                            <br>

                            <small>
                                ${payment.id}
                            </small>

                        </span>

                        <b>

                            ${money(
                                payment.amount
                            )}

                            <br>

                            <small>
                                ${payment.method}
                            </small>

                        </b>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================
   PROFILE
   ========================================= */

function initializeProfile() {

    const form =
        document.getElementById(
            "profileForm"
        );


    if (!form) {
        return;
    }


    const profile =
        JSON.parse(
            localStorage.getItem(
                PROFILE_KEY
            ) || "{}"
        );


    const email =
        localStorage.getItem(
            "customerEmail"
        ) || "";


    document.getElementById(
        "name"
    ).value =
        profile.name || "";


    document.getElementById(
        "email"
    ).value =
        profile.email ||
        email;


    document.getElementById(
        "phone"
    ).value =
        profile.phone || "";


    document.getElementById(
        "profileAddress"
    ).value =
        profile.address || "";


    if (profile.name) {

        document.getElementById(
            "profileName"
        ).textContent =
            profile.name;

    }


    if (
        profile.email ||
        email
    ) {

        document.getElementById(
            "profileEmail"
        ).textContent =
            profile.email || email;

    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const data = {

                name:
                    document.getElementById(
                        "name"
                    ).value,

                email:
                    document.getElementById(
                        "email"
                    ).value,

                phone:
                    document.getElementById(
                        "phone"
                    ).value,

                address:
                    document.getElementById(
                        "profileAddress"
                    ).value

            };


            localStorage.setItem(
                PROFILE_KEY,
                JSON.stringify(data)
            );


            document.getElementById(
                "profileName"
            ).textContent =
                data.name;


            document.getElementById(
                "profileEmail"
            ).textContent =
                data.email;


            toast(
                "Profile saved successfully!"
            );

        }
    );


    renderBookingHistory();

}


/* =========================================
   BOOKING HISTORY
   ========================================= */

function renderBookingHistory() {

    const history =
        document.getElementById(
            "historyBookings"
        );


    if (!history) {
        return;
    }


    const booking =
        getBooking();


    if (!booking) {

        history.innerHTML = `

            <p>
                No bookings yet.
            </p>

        `;

        return;
    }


    history.innerHTML = `

        <div class="history-row">

            <span>

                <b>
                    ${booking.package}
                </b>

                <br>

                ${booking.date}
                •
                ${booking.time}

                <br>

                <small>
                    ${booking.id}
                </small>

            </span>


            <b>

                ${money(booking.total)}

                <br>

                <small>
                    ${statuses[booking.status]}
                </small>

            </b>

        </div>

    `;

}


/* =========================================
   REBOOK
   ========================================= */

function rebookLast() {

    const booking =
        getBooking();


    if (!booking) {

        toast(
            "No previous booking found."
        );

        return;
    }


    localStorage.setItem(
        "quickPackage",
        booking.package
    );


    window.location.href =
        "Booking.html";

}


/* =========================================
   REVIEW
   ========================================= */

function submitReview() {

    const booking =
        getBooking();


    if (!booking) {

        toast(
            "Please complete a booking first."
        );

        return;
    }


    const review =
        document.getElementById(
            "reviewText"
        ).value;


    if (!review.trim()) {

        toast(
            "Please enter your review."
        );

        return;
    }


    localStorage.setItem(
        "customerReview",
        review
    );


    toast(
        "Thank you! Your review has been submitted."
    );

}