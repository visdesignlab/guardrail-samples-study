/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from 'react';
import {
  Box, Stack, Text, Paper, Loader,
} from '@mantine/core';
import * as d3 from 'd3';
import { LineChart } from './LineChart';
import RankingWidget from './RankingWidget';

const chartConfigs = [
  { label: 'A', guardrail: 'percentileClosest' },
  { label: 'B', guardrail: 'super_data' },
  { label: 'C', guardrail: 'metadata' },
  { label: 'D', guardrail: 'cluster' },
];

export function CovidMetadataTask({ parameters, setAnswer }: any) {
  const [data, setData] = useState<any[] | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dataname, setDataname] = useState<string>(parameters.dataset || 'clean_data');
  const [items, setItems] = useState<any[] | null>(null);
  const [range, setRange] = useState<[Date, Date] | null>([new Date(parameters.start_date || '2020-03-01'), new Date(parameters.end_date || '2021-08-28')]);
  const [selection] = useState<string[] | null>(parameters.selection || ['Norway']);
  const [numRandomSamples] = useState<number>(parameters.numRandomSamples ?? 5);
  const [numQuantiles] = useState<number>(parameters.numQuantiles ?? 5);
  const [_order, setOrder] = useState<string[]>(['A', 'B', 'C', 'D']);
  useEffect(() => {
    setAnswer?.({ status: true, answers: { 'chart-ranking': _order } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setRange([new Date(parameters.start_date || '2020-03-01'), new Date(parameters.end_date || '2021-08-28')]);
    }
  }, [dataname, parameters.cat_var, parameters.group_var, parameters.start_date, parameters.end_date]);

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
    <Box style={{ width: 850, alignContent: 'center' }}>
      <Text mb="md">
        Below are four charts comparing Norway’s COVID-19 cases to different sets of countries. Which chart do you think shows the most useful and appropriate comparison for Norway?
      </Text>
      <Stack>
        {chartConfigs.map(({ label, guardrail }) => (
          <Paper key={label} shadow="xs" radius="md" p="md" mb="md" withBorder>
            <Text fw={700} ta="center" mb={4}>{label}</Text>
            <Text fw={500}>Total infections per million people</Text>
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
                start_date: parameters.start_date || '2020-03-01',
                end_date: parameters.end_date || '2021-08-28',
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
        ))}
      </Stack>
      <Box style={{ paddingTop: '32px' }}>
        <RankingWidget
          onChange={(newOrder) => {
            setOrder(newOrder);
            setAnswer?.({ status: true, answers: { 'chart-ranking': newOrder } });
          }}
        />
      </Box>
    </Box>
  );
}

export default CovidMetadataTask;
