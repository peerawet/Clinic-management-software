import Card from "react-bootstrap/Card";
import { features } from "../data/featureData.js";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Accordion from "react-bootstrap/Accordion";
import { useState } from "react";
import DynamicComponent from "./DynamicComponent.jsx";

function FeatureList() {
  const [activeTab, setActiveTab] = useState("Check in");
  const [searchPatients, setSearchPatients] = useState([]);
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
          defaultActiveKey="Check in"
          className="mb-3"
          activeKey={activeTab}
          onSelect={(tab) => setActiveTab(tab)}
        >
          {features.map((feature) => {
            return (
              <Tab
                key={feature.name}
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
                      style={{ aspectRatio: "1/1" }}
                    />
                    <Card.Body>
                      <Card.Text>{feature.name}</Card.Text>
                    </Card.Body>
                  </Card>
                }
              >
                <DynamicComponent
                  type={feature.componentType}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  searchPatients={searchPatients}
                  setSearchPatients={setSearchPatients}
                />
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
        {features.map((feature, index) => {
          return (
            <Accordion key={index} defaultActiveKey="0" flush>
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
                      style={{ aspectRatio: "1/1" }}
                    />
                    <Card.Body>
                      <Card.Text>{feature.name}</Card.Text>
                    </Card.Body>
                  </Card>
                </Accordion.Header>
                <Accordion.Body>
                  <DynamicComponent type={feature.componentType} />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
}

export default FeatureList;
