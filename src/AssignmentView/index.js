import React, { useEffect, useState } from 'react';
import { useLocalState } from '../util/UseLocalStorage';
import ajax from '../services/fetchService';
import { Badge, Button, ButtonGroup, Col, Container, Dropdown, DropdownButton, Form, Row } from 'react-bootstrap';

const AssignmentView = () => {
    const assignmentId = window.location.href.split("/assignments/")[1];
    const [assignment, setAssignment] = useState({
        branch: "",
        githubUrl: ""
    });
    const [assignmentEnums, setAssignmentEnums] = useState([]);
    const [jwt, setJwt] = useLocalState("", "jwt");

    function updateAssignment(prop, value) {
        const newAssignment = {...assignment};
        newAssignment[prop] = value;
        setAssignment(newAssignment);
    }

    function save() {
        ajax(`/api/v1/assignments/${assignmentId}`, "PUT", jwt, assignment).then(
            (assignmentData) => {
                setAssignment(assignmentData);
            }
        );
    }

    useEffect(() => {
        ajax(`/api/v1/assignments/${assignmentId}`, "GET", jwt).then(
            (assignmentResponse) =>{
                let assignmentData = assignmentResponse.assignment;
                if (assignmentData.branch === null) assignmentData.branch = "";
                if (assignment.githubUrl === null) assignmentData.githubUrl = "";
                setAssignment(assignmentData);
                setAssignmentEnums(assignmentResponse.assignmentEnums);
            }
        );    
    }, []);

    return (
        <Container className="mt-5">

            <Row className="d-flex align-items-center">
                <Col>
                    <h1>Assignment {assignmentId} </h1>
                </Col>
                <Col>
                    <Badge pill bg="info" style={{ fontSize : "1em" }}>
                        {assignment.status}
                    </Badge>
                </Col>
            </Row>

    
            {assignment ? ( 
                <>

                    <Form.Group as={Row} className="my-4" controlId="formPlaintextEmail">
                        <Form.Label column sm="2">
                            Assignment Number:
                        </Form.Label>

                        <Col className="d-flex align-items-center">
                            <DropdownButton
                                as={ButtonGroup}
                                id={"assignmentName"}
                                variant={"info"}
                                title= {assignmentId}
                            >
                                {['1','2','3','4','5','6'].map(assignmentNum => 
                                    <Dropdown.Item eventKey={assignmentNum}>{assignmentNum}</Dropdown.Item>
                                )}
                        
                            </DropdownButton>
                        </Col>

                    </Form.Group>

                    <Form.Group as={Row} className="my-4" controlId="formPlaintextEmail">
                        <Form.Label column sm="2">
                            GitHub URL:
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control 
                            id="githubUrl"
                            onChange={(e) => updateAssignment("githubUrl", e.target.value)}
                            type="url" 
                            value={assignment.githubUrl}
                            placeholder="https://github.com/username/repo-name"/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Form.Label column sm="2">
                            Branch:
                        </Form.Label>
                        <Col sm="10">
                            <Form.Control 
                            id="branch"
                            onChange={(e) => updateAssignment("branch", e.target.value)}
                            type="text" 
                            value={assignment.branch}
                            placeholder="example_branch_main"/>
                        </Col>
                    </Form.Group>

                    <Button size="lg" onClick = {() => save()}> Submit Assignment </Button>

                </> 
            ) : (
                <></>
            )}
        </Container>
    );
};

export default AssignmentView;