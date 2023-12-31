import Card from "react-bootstrap/Card";
import { features } from "../data/features.jsx";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Accordion from "react-bootstrap/Accordion";

function FeatureList() {
  return (
    <div>
      {/* render for desktop */}
      <div
        css={css`
          margin-top: 1rem;
          @media (max-width: 720px) {
            display: none;
          }
        `}
      >
        <Tabs
          defaultActiveKey="profile"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          {features.map((feature) => {
            return (
              <Tab
                eventKey={feature.name}
                title={
                  <Card
                    css={css`
                      width: 8rem;
                      &:hover {
                        border-color: green;
                      }
                    `}
                  >
                    <Card.Img
                      variant="top"
                      src={feature.picture}
                      s
                      style={{ aspectRatio: "1/1" }}
                    />
                    <Card.Body>
                      <Card.Text>{feature.name}</Card.Text>
                    </Card.Body>
                  </Card>
                }
              >
                {feature.component}
              </Tab>
            );
          })}
        </Tabs>
      </div>

      {/* render for mobile */}
      <div
        css={css`
          margin-top: 1rem;
          @media (min-width: 720px) {
            display: none;
          }
        `}
      >
        {features.map((feature) => {
          return (
            <Accordion defaultActiveKey="0" flush>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <Card
                    css={css`
                      width: 8rem;
                      &:hover {
                        border-color: green;
                      }
                    `}
                  >
                    <Card.Img
                      variant="top"
                      src={feature.picture}
                      s
                      style={{ aspectRatio: "1/1" }}
                    />
                    <Card.Body>
                      <Card.Text>{feature.name}</Card.Text>
                    </Card.Body>
                  </Card>
                </Accordion.Header>
                <Accordion.Body>{feature.component}</Accordion.Body>
              </Accordion.Item>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
}

export default FeatureList;
