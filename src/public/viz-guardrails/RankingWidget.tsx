import React, { useState } from 'react';
import {
  Group, Paper, Text, Box, Button,
} from '@mantine/core';

const chartLabels = [
  { id: 'A', label: 'Chart A' },
  { id: 'B', label: 'Chart B' },
  { id: 'C', label: 'Chart C' },
  { id: 'D', label: 'Chart D' },
];

export default function RankingWidget({ onChange }: { onChange?: (order: string[]) => void }) {
  const [order, setOrder] = useState(chartLabels.map((c) => c.id));
  const [dragged, setDragged] = useState<string | null>(null);

  const handleDragStart = (id: string) => setDragged(id);
  const handleDragEnd = () => setDragged(null);

  const handleDrop = (targetId: string) => {
    if (!dragged || dragged === targetId) return;
    const from = order.indexOf(dragged);
    const to = order.indexOf(targetId);
    const newOrder = [...order];
    newOrder.splice(from, 1);
    newOrder.splice(to, 0, dragged);
    setOrder(newOrder);
    setDragged(null);
    if (onChange) onChange(newOrder);
  };

  return (
    <Box>
      <Text fw={500} ta="center">Rank the charts from most to least useful (left = most useful)</Text>
      <Group gap="xs" justify="center" wrap="nowrap">
        {order.map((id) => {
          const label = chartLabels.find((c) => c.id === id)?.label || id;
          return (
            <Paper
              key={id}
              shadow={dragged === id ? 'md' : 'xs'}
              p="md"
              radius="md"
              withBorder
              style={{
                minWidth: 100,
                minHeight: 60,
                opacity: dragged === id ? 0.5 : 1,
                cursor: 'grab',
                background: dragged === id ? '#f1f3f5' : undefined,
                transition: 'box-shadow 0.2s, opacity 0.2s',
              }}
              draggable
              onDragStart={() => handleDragStart(id)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(id)}
            >
              <Text ta="center" fw={700}>{label}</Text>
            </Paper>
          );
        })}
      </Group>
      <Box mt="sm" ta="center">
        <Button size="xs" variant="light" onClick={() => setOrder(chartLabels.map((c) => c.id))}>
          Reset order
        </Button>
      </Box>
    </Box>
  );
}
