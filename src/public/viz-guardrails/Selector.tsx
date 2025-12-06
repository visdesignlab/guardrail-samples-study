import {
  NumberInput, Select, SegmentedControl, Switch, Text,
} from '@mantine/core';

export function Selector({
  guardrail,
  setGuardrail,
  dataname,
  setDataname,
  setSelection,
  setMetadataFiltered,
  numRandomSamples,
  setNumRandomSamples,
}: {
    guardrail: string;
    setGuardrail: (value: string) => void;
    dataname: string;
    setDataname: (value: string) => void;
    setSelection: (value: Array<string>) => void;
    setMetadataFiltered: (value: boolean) => void;
    numRandomSamples: number;
    setNumRandomSamples: (value: number) => void;
}) {
  return (
    <>
      <Text>Data:</Text>
      <SegmentedControl
        value={dataname}
        onChange={(x) => { setDataname(x); setSelection([]); }}
        data={[
          { value: 'clean_data', label: 'Viral' },
          { value: 'sp500_stocks', label: 'Stock' },
        ]}
      />
      <Text style={{ marginTop: '10px' }}>
        Guardrail:
      </Text>
      <Select
        value={guardrail}
        onChange={(x) => x && setGuardrail(x)}
        data={[
          { value: 'none', label: 'None' },
          { value: 'super_data', label: 'Random Exemplars' },
          { value: 'super_summ', label: 'Average of All lines' },
          { value: 'median', label: 'Median of Each Timestamp' },
          { value: 'medianClosest', label: 'Actual Item Closest to Median' },
          { value: 'medianIQR', label: 'Median of +-1.5IQR At Each Timestamp' },
          { value: 'medianIQRClosest', label: 'Actual Item Closest to Median +-1.5IQR' },
          { value: 'percentiles', label: 'Percentile Markers' },
          { value: 'percentileClosest', label: 'Percentiles-based Exemplars' },
          { value: 'cluster', label: 'Cluster Representatives' },
          { value: 'metadata', label: 'Exemplars with Semantic Sampling' },
          { value: 'all', label: 'All' },
        ]}
      />
      <Switch
        label={dataname === 'clean_data' ? 'Filter by UN Region (metadata)' : 'Filter by Sector (metadata)'}
        onChange={(event) => setMetadataFiltered(event.currentTarget.checked)}
        style={{ marginTop: '10px' }}
      />
      {guardrail === 'super_data' && (
      <div style={{ marginTop: '10px' }}>
        <NumberInput
          label="Number of Random samples"
          value={numRandomSamples}
          onChange={(val) => typeof val === 'number' && setNumRandomSamples(val)}
          min={1}
          max={15}
          step={1}
          style={{ marginTop: '10px', width: '200px' }}
        />
        <Text size="xs" color="dimmed" mt={4} style={{ marginLeft: '2px' }}>
          Maximum of 15
        </Text>
      </div>
      )}

    </>
  );
}

export default Selector;
