import React, { useState, useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';

const MultiSelectCheckbox = ({ options, title, onSelectionChange }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [otherText, setOtherText] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);

  const allOptions = [...options, 'Other'];

  useEffect(() => {
    onSelectionChange(getSelectedValues());
  }, [selectedOptions, otherText, showOtherInput]);

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });

    if (option === 'Other') {
      setShowOtherInput((prev) => !prev);
      if (showOtherInput) {
        setOtherText('');
      }
    }
  };

  const handleOtherTextChange = (e) => {
    setOtherText(e.target.value);
  };

  const getSelectedValues = () => {
    const selected = selectedOptions.filter(option => option !== 'Other');
    if (showOtherInput && otherText) {
      selected.push(`Other: ${otherText}`);
    }
    return selected;
  };

  return (
    <Card className="mt-4" style={{ maxWidth: '400px' }}>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form>
          {allOptions.map((option) => (
            <div key={option} className="mb-2">
              <Form.Check
                type="checkbox"
                id={option}
                label={option}
                checked={selectedOptions.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
              {option === 'Other' && showOtherInput && (
                <Form.Control
                  type="text"
                  placeholder="Please specify"
                  value={otherText}
                  onChange={handleOtherTextChange}
                  className="mt-2 ml-4"
                />
              )}
            </div>
          ))}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default MultiSelectCheckbox;