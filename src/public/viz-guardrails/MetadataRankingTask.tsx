/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useEffect, useState, useMemo, useRef,
} from 'react';
import seedrandom from 'seedrandom';
import {
  Box, SimpleGrid, Text, Paper, Loader, Card,
} from '@mantine/core';
import * as d3 from 'd3';
import { LineChart } from './LineChart';
import RankingWidget from './RankingWidget';

const baseGuardrails = ['percentileClosest', 'super_data', 'metadata', 'cluster'] as const;
type GuardrailType = typeof baseGuardrails[number];

export function MetadataRankingTask({ parameters, setAnswer }: any) {
  const [data, setData] = useState<any[] | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dataname, setDataname] = useState<string>(parameters.dataset || 'clean_data');
  const [items, setItems] = useState<any[] | null>(null);
  const [range, setRange] = useState<[Date, Date] | null>([new Date(parameters.start_date || '2020-03-01'), new Date(parameters.end_date || '2021-08-28')]);
  const [selection] = useState<string[] | null>(parameters.selection || ['Norway']);
  const [numRandomSamples] = useState<number>(parameters.numRandomSamples ?? 5);
  const [numQuantiles] = useState<number>(parameters.numQuantiles ?? 5);
  const [baseGuardrailOrder, setBaseGuardrailOrder] = useState<GuardrailType[]>([]);
  const [rankingOrder, setRankingOrder] = useState<GuardrailType[]>([]);
  const initialSeedRef = useRef<string | null>(null);
  if (initialSeedRef.current === null) {
    initialSeedRef.current = Date.now().toString();
  }
  const seededOrder = useMemo(() => {
    const rng = seedrandom(initialSeedRef.current!);
    const arr = [...baseGuardrails];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  useEffect(() => {
    setBaseGuardrailOrder(seededOrder);
    setRankingOrder(seededOrder);
    setAnswer?.({ status: true, answers: { 'chart-ranking': seededOrder } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seededOrder]);

  useEffect(() => {
    d3.csv(`./data/${dataname}.csv`).then((csvData) => {
      setData(csvData);
      setItems(Array.from(new Set(csvData.map((row) => (JSON.stringify({
        name: row[parameters.cat_var || 'name'],
        group: row[parameters.group_var || 'region'],
        longName: row.long_name || null,
        sector: row.sector || null,
        subregion: row.subregion || null,
      }))))).map((row) => JSON.parse(row)));
    });
    if (dataname === 'clean_data') {
      setRange([new Date('2020-03-01'), new Date('2021-08-28')]);
    } else {
      setRange([new Date('2024-01-01'), new Date('2024-12-31')]);
    }
  }, [dataname, parameters.cat_var, parameters.group_var]);

  const filteredData = useMemo(() => {
    if (data && range) {
      return data
        .filter((val) => (new Date(val[parameters.x_var || 'date'])).getTime() >= range[0].getTime())
        .filter((val) => (new Date(val[parameters.x_var || 'date'])).getTime() <= range[1].getTime());
    }
    return null;
  }, [data, range, parameters.x_var]);

  if (!filteredData || !items || !range || !selection) {
    return <Loader />;
  }

  return (
    <Box style={{ width: '95vw', alignContent: 'center' }}>
      <Card shadow="sm" radius="md" p="md" mb="md" withBorder>
        <Text mb="0">
          {dataname === 'clean_data'
            ? 'Below are four charts comparing Norway’s COVID-19 cases to different sets of countries. Which chart do you think shows the most useful and appropriate comparison for Norway?'
            : 'Below are four charts comparing Verizon’s (VZ) stock performance to different sets of stocks. Which chart do you think shows the most useful and appropriate comparison for Verizon (VZ)?'}
        </Text>
      </Card>
      <SimpleGrid cols={2} spacing="lg">
        {baseGuardrailOrder.map((guardrail, idx) => {
          const label = `Chart ${String.fromCharCode(65 + idx)}`;
          return (
            <Paper key={guardrail} shadow="xs" radius="md" p="md" mb="md" withBorder>
              <Text fw={700} ta="center" mb={4} fz="lg">{label}</Text>
              <Text fw={500}>{dataname === 'clean_data' ? 'Total infections per million people' : 'Percent change in stock price'}</Text>
              <LineChart
                parameters={{
                  ...parameters,
                  guardrail,
                  selection,
                  dataset: dataname,
                  x_var: parameters.x_var || 'date',
                  y_var: parameters.y_var || 'value',
                  cat_var: parameters.cat_var || 'name',
                  group_var: parameters.group_var || 'region',
                  start_date: parameters.start_date || (dataname === 'clean_data' ? '2020-03-01' : '2024-01-01'),
                  end_date: parameters.end_date || (dataname === 'clean_data' ? '2021-08-28' : '2024-12-31'),
                }}
                data={filteredData}
                dataname={dataname}
                items={items}
                selection={selection}
                range={range}
                guardrail={guardrail}
                numRandomSamples={numRandomSamples}
                numQuantiles={numQuantiles}
                metadataFiltered={false}
              />
            </Paper>
          );
        })}
      </SimpleGrid>
      <Box style={{ paddingTop: '32px' }}>
        <RankingWidget
          baseSequence={baseGuardrailOrder}
          value={rankingOrder}
          onChange={(newOrder) => {
            setRankingOrder(newOrder as GuardrailType[]);
            setAnswer?.({ status: true, answers: { 'chart-ranking': newOrder } });
          }}
        />
      </Box>
    </Box>
  );
}

export default MetadataRankingTask;
