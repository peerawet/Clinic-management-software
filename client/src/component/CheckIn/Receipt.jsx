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
}) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState({}); //{PT: 'transfer', SWT: 'credit card'}

  const params = useParams();

  useEffect(() => {
    let sum = 0;
    treatments.forEach((treatment) => {
      treatment.details.forEach((detail) => {
        const selectedTreatment = selectedAppointment.treatmentInfo.find(
          (t) => t._id === treatment._id && t.isSelected
        );

        if (selectedTreatment) {
          sum += detail.price;
        }
      });
    });
    setTotalPrice(sum);
  }, [selectedAppointment, treatments]);

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

      //update remaining course
      const useCourseTreatmentIds = selectedAppointment.treatmentInfo //useCourseTreatmentIds = [PT,HLT...]
        .filter((treatment) => treatment.isSelected)
        .map((treatment) => treatment._id);
      // await axios.put(
      //   `http://localhost:2001/courses-patients/${}`
      // );

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
                treatment.details.map(
                  (detail) =>
                    selectedAppointment.treatmentInfo.some(
                      (selectedTreatment) =>
                        selectedTreatment._id === treatment._id &&
                        selectedTreatment.isSelected
                    ) && (
                      <tr key={detail.procedure}>
                        <td>{detail.procedure}</td>
                        <td>{detail.price}</td>
                      </tr>
                    )
                )
              )}
              <tr>
                <th>Total price</th>
                <th>{totalPrice}</th>
              </tr>
            </tbody>
          </Table>
          {selectedAppointment.status === "check in" ? (
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: 1rem;
              `}
            >
              {selectedAppointment.treatmentInfo.map((treatment) => (
                <div
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

                          setPaymentMethods((prevMethods) => ({
                            ...prevMethods,
                            [treatment._id]: selectedPaymentMethod,
                          }));
                        }}
                      >
                        <option value="">Select payment method</option>{" "}
                        <option value="cash">Cash</option>
                        <option value="transfer">Transfer</option>
                        <option value="credit card">Credit Card</option>
                        {patientCourses.map((patientCourse) => (
                          <>
                            {(patientCourse.treatment_id === treatment._id) &
                              (patientCourse.permitted[params.id] === true) && (
                              <option value={patientCourse._id}>
                                {patientCourse.remaining}/{patientCourse.total}{" "}
                                {patientCourse.name}
                              </option>
                            )}
                          </>
                        ))}
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
          ) : (
            <div
              css={css`
                display: flex;
                gap: 1rem;
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
          )}
        </>
      )}
    </div>
  );
}

export default Receipt;
