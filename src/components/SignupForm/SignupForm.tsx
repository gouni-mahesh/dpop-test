import React from "react";
import { useTestDpop } from "../../api/hooks/d-pop"; // adjust path

const DpopTestForm: React.FC = () => {
  const testDpopMutation = useTestDpop();

  const handleTestDpop = () => {
    testDpopMutation.mutate();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "300px" }}>
      <h2>DPoP Test</h2>

      <button
        onClick={handleTestDpop}
        disabled={testDpopMutation.isPending}
        style={{ padding: "8px 16px" }}
      >
        {testDpopMutation.isPending ? "Testing..." : "Test DPoP"}
      </button>

      {testDpopMutation.isSuccess && (
        <p style={{ color: "green" }}>
          ✅ {JSON.stringify(testDpopMutation.data)}
        </p>
      )}

      {testDpopMutation.isError && (
        <p style={{ color: "red" }}>
          ❌ Error: {testDpopMutation.error.message}
        </p>
      )}
    </div>
  );
};

export default DpopTestForm;
