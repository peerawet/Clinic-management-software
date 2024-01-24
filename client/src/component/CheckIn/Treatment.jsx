import { Form } from "react-bootstrap";
import { css } from "@emotion/react";
import { Axios } from "axios";
/** @jsxImportSource @emotion/react */
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Treatment({
  setSelectedAppointment,
  treatments,
  selectedAppointment,
  patientCourses,
}) {
  const params = useParams();
  const renderCourseInfo = (treatmentId) => {
    const courses = patientCourses.filter(
      (patientCourse) =>
        (patientCourse.treatment_id === treatmentId) &
        (patientCourse.permitted[params.id] === true)
    );
    const count = courses.length;
    return courses.length > 0 && <div>มี {count} คอร์ส</div>;
  };

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <h5>Please select treatments</h5>
      <Form
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
        `}
      >
        {treatments.map((treatment) => (
          <div
            key={treatment._id}
            css={css`
              display: flex;
              gap: 1rem;
            `}
          >
            <Form.Check
              type="switch"
              label={treatment.name}
              onChange={() => {
                const updatedTreatmentInfo =
                  selectedAppointment.treatmentInfo.map((treatmentInfo) =>
                    treatmentInfo._id === treatment._id
                      ? {
                          ...treatmentInfo,
                          isSelected: !treatmentInfo.isSelected,
                        }
                      : treatmentInfo
                  );

                setSelectedAppointment({
                  ...selectedAppointment,
                  treatmentInfo: updatedTreatmentInfo,
                });
              }}
            />
            {renderCourseInfo(treatment._id)}
          </div>
        ))}
      </Form>
    </div>
  );
}

export default Treatment;

// const cloneSelectedAppoinment = { ...selectedAppointment };
// setSelectedAppointment({
//   ...cloneSelectedAppoinment,
//   treatmentInfo: {
//     ...cloneSelectedAppoinment.treatmentInfo,
//     [treatment.name]:
//       !cloneSelectedAppoinment.treatmentInfo?.[treatment.name],
//   },
// });
// setSelectedAppointment((prevState) => ({
//   ...prevState,
//   treatmentInfo: {
//     ...prevState.treatmentInfo,
//     [treatment.name]: !prevState.treatmentInfo?.[treatment.name],
//   },
// }));
