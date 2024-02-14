import { css } from "@emotion/react";
/** @jsxImportSource @emotion/react */
import React from "react";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router-dom";

function Receipt({
  selectedAppointment,
  treatments,
  fetchAppointments,
  handleShowModal,
  setSelectedAppointment,
  patientCourses,
  paymentMethods,
  setPaymentMethods,
}) {
  const params = useParams();
  const [noPromotionPrices, setNoPromotionPrices] = useState({}); //{PT: 2700, SWT: 2200, HLT: 1700, ST: 1400}
  const [promotionPrices, setPromotionPrices] = useState({}); //{PT: 1550, SWT: 1650,}
  //const [paymentMethods, setPaymentMethods] = useState({}); //{PT: _id, SWT:  _id, HLT: "cash", ST: "tranfer"}

  //calculate total no promotion price
  const totalNoPromotionPrice = Object.values(noPromotionPrices).reduce(
    (acc, price) => acc + price,
    0
  );
  //calculate total discont
  let totalDiscount = 0;
  for (const key in noPromotionPrices) {
    if (
      noPromotionPrices.hasOwnProperty(key) &&
      promotionPrices.hasOwnProperty(key)
    ) {
      const difference = noPromotionPrices[key] - promotionPrices[key];
      totalDiscount += difference;
    }
  }

  //calculate no promotion price object
  useEffect(() => {
    const newTotalPrices = {};

    treatments.forEach((treatment) => {
      let sum = 0;

      treatment.details.forEach((detail) => {
        const selectedTreatment = selectedAppointment.treatmentInfo.find(
          (t) => t._id === treatment._id && t.isSelected
        );

        if (selectedTreatment) {
          sum += detail.price;
        }
      });

      newTotalPrices[treatment._id] = sum;
    });

    setNoPromotionPrices(newTotalPrices);
  }, [selectedAppointment, treatments, patientCourses, paymentMethods]);

  //calculate promotion price object
  useEffect(() => {
    console.log("treatments:", treatments);
    console.log("patientCourses:", patientCourses);
    console.log("paymentMethods:", paymentMethods);
    let newPromotionPrices = {};

    treatments.forEach((treatment) => {
      const course = patientCourses.find(
        (c) => paymentMethods[treatment._id] === c._id
      );

      if (course && course.courseInfo) {
        const promotionPriceForTreatment =
          course.price / course.courseInfo.total;
        newPromotionPrices[treatment._id] = promotionPriceForTreatment;
      }
    });

    setPromotionPrices(newPromotionPrices);
    console.log(promotionPrices);
  }, [treatments, patientCourses, paymentMethods]);

  const hasTreatments =
    selectedAppointment && selectedAppointment.treatmentInfo
      ? selectedAppointment.treatmentInfo.some(
          (treatment) => treatment.isSelected
        )
      : false;

  const handlePayment = async () => {
    try {
      // Update appointment status to "paid"

      const updatedAppointmentFrontEnd = {
        ...selectedAppointment,
        status: "paid",
      };
      const updatedAppointmentBackEnd = {
        ...selectedAppointment,
        status: "paid",
      };

      delete updatedAppointmentBackEnd.patientInfo;
      delete updatedAppointmentBackEnd.doctorInfo;
      delete updatedAppointmentBackEnd.treatmentInfo;
      await axios.put(
        `http://localhost:2001/appointments/${updatedAppointmentBackEnd._id}`,
        updatedAppointmentBackEnd
      );

      // Create a new receipt
      const receiptId = getReceiptId();
      await axios.post("http://localhost:2001/receipts/", {
        _id: receiptId,
        appointment_id: updatedAppointmentBackEnd._id,
        created: new Date(),
      });

      // Create many-to-many relationships in receipts_treatments table
      const selectedTreatmentIds = selectedAppointment.treatmentInfo //selectedTreatmentIds = [PT,HLT...]
        .filter((treatment) => treatment.isSelected)
        .map((treatment) => treatment._id);

      for (const treatmentId of selectedTreatmentIds) {
        await axios.post("http://localhost:2001/receipts_treatments/", {
          receipt_id: receiptId,
          treatment_id: treatmentId,
          paymentMethods: paymentMethods[treatmentId],
        });
      }

      handleShowModal(updatedAppointmentFrontEnd);
      await fetchAppointments();
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const getReceiptId = () => {
    const branch = params.id.toUpperCase();
    const patientId = selectedAppointment.patientInfo._id;
    const doctorId = selectedAppointment.doctorInfo._id;

    const currentDate = new Date();
    const formatDate = currentDate.getTime();

    return `RCT-${branch}-${formatDate}-${patientId}-${doctorId}`;
  };

  return (
    <div>
      {hasTreatments && (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Treatments</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {treatments.map((treatment) =>
                treatment.details.map((detail) =>
                  selectedAppointment.treatmentInfo.some(
                    (selectedTreatment) =>
                      selectedTreatment._id === treatment._id &&
                      selectedTreatment.isSelected
                  ) ? (
                    <tr key={detail.procedure}>
                      <td>{detail.procedure}</td>
                      <td>{detail.price}</td>
                    </tr>
                  ) : null
                )
              )}

              <tr>
                <th>ราคา</th>
                <th>{totalNoPromotionPrice}</th>
              </tr>

              <tr>
                <th>ส่วนลด</th>
                <th>{totalDiscount}</th>
              </tr>

              <tr>
                <th>ราคาสุทธิ</th>
                <th>{totalNoPromotionPrice - totalDiscount}</th>
              </tr>
            </tbody>
          </Table>
          <div
            css={css`
              display: ${selectedAppointment.status === "check in"
                ? "flex"
                : "none"};
              flex-direction: column;
              gap: 1rem;
            `}
          >
            {selectedAppointment.treatmentInfo.map((treatment, i) => (
              <div
                key={treatment._id}
                css={css`
                  display: flex;
                  gap: 1rem;
                  align-items: center;
                `}
              >
                {treatment.isSelected === true && (
                  <>
                    <div
                      css={css`
                        width: fit-content;
                      `}
                    >
                      {treatment.name}
                    </div>
                    <Form.Select
                      css={css`
                        width: fit-content;
                      `}
                      onChange={(e) => {
                        const selectedPaymentMethod = e.target.value;

                        setPaymentMethods((prevMethods) => {
                          // Create a copy of the existing state
                          const newMethods = { ...prevMethods };

                          // Update or add the selected payment method for the current treatment
                          newMethods[treatment._id] = selectedPaymentMethod;

                          return newMethods;
                        });
                      }}
                    >
                      <option value="">Select payment method</option>{" "}
                      <option value="cash">Cash</option>
                      <option value="transfer">Transfer</option>
                      <option value="credit card">Credit Card</option>
                      {patientCourses.map((patientCourse) =>
                        patientCourse.courseInfo.treatment_id ===
                          treatment._id &&
                        patientCourse.courseInfo.permitted[params.id] ===
                          true ? (
                          <option
                            key={patientCourse._id}
                            value={patientCourse._id}
                          >
                            {`${patientCourse.remaining}/
          ${patientCourse.courseInfo.total} 
          ${patientCourse.courseInfo.name}`}
                          </option>
                        ) : null
                      )}
                    </Form.Select>
                  </>
                )}
              </div>
            ))}

            <Button
              css={css`
                flex: 1;
              `}
              onClick={handlePayment}
            >
              Pay
            </Button>
          </div>

          <div
            css={css`
              gap: 1rem;
              display: ${selectedAppointment.status === "paid" ||
              selectedAppointment.status === "being treated" ||
              selectedAppointment.status === "completed"
                ? "flex"
                : "none"};
            `}
          >
            <Button
              variant="secondary"
              css={css`
                flex: 1;
              `}
            >
              Print receipt
            </Button>
            <Button
              variant="secondary"
              css={css`
                flex: 1;
              `}
            >
              Download receipt
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Receipt;
