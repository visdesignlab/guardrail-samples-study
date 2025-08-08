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
  const [preview, setPreview] = useState<string[] | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const current = preview ?? order;

  const moveItem = (arr: string[], fromId: string, toId: string) => {
    if (fromId === toId) return arr;
    const from = arr.indexOf(fromId);
    const to = arr.indexOf(toId);
    if (from === -1 || to === -1) return arr;
    const next = [...arr];
    next.splice(from, 1);
    next.splice(to, 0, fromId);
    return next;
  };

  const handleDragStart = (id: string) => setDragged(id);
  const handleDragEnd = () => {
    setDragged(null);
    setPreview(null);
    setOverId(null);
  };

  const handleDragOver = (targetId: string, e: React.DragEvent) => {
    e.preventDefault();
    if (!dragged) return;
    setOverId(targetId);
    const base = preview ?? order;
    const next = moveItem(base, dragged, targetId);
    if (next.join('|') !== base.join('|')) setPreview(next);
  };

  const handleDrop = (targetId: string) => {
    if (!dragged) return;
    const base = preview ?? order;
    const committed = moveItem(base, dragged, targetId);
    setOrder(committed);
    setDragged(null);
    setPreview(null);
    setOverId(null);
    if (onChange) onChange(committed);
  };

  return (
    <Box>
      <Text fw={500} ta="center">Please rank the charts from best to worst in terms of how appropriate and useful they are as comparisons for Norway. (Left = Best)</Text>
      <Group gap="xs" justify="center" wrap="nowrap">
        {current.map((id) => {
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
                background: dragged === id ? '#f1f3f5' : overId === id ? '#edf2ff' : undefined,
                outline: overId === id ? '2px dashed #4c6ef5' : undefined,
                transition: 'box-shadow 0.2s, opacity 0.2s, background 0.1s',
              }}
              draggable
              onDragStart={() => handleDragStart(id)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(id, e)}
              onDragEnter={(e) => handleDragOver(id, e as unknown as React.DragEvent)}
              onDrop={() => handleDrop(id)}
            >
              <Text ta="center" fw={700}>{label}</Text>
            </Paper>
          );
        })}
      </Group>
      <Box mt="sm" ta="center">
        <Button
          size="xs"
          variant="light"
          onClick={() => {
            setOrder(chartLabels.map((c) => c.id));
            setPreview(null);
            setOverId(null);
          }}
        >
          Reset order
        </Button>
      </Box>
    </Box>
  );
}
