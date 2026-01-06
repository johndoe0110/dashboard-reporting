import Alert from '../common/Alert';

export default function RoasAlert({ currentRoas = 0.91, targetRoas = 2.0 }) {
  if (currentRoas >= targetRoas) {
    return null;
  }

  return (
    <Alert
      type="warning"
      title="ROAS Below Target"
      message={`Current ROAS is ${currentRoas}x. Target is ${targetRoas}x or higher.`}
      className="mb-4"
    />
  );
}
