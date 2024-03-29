use fueros_derive::JsEnum;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::wasm_bindgen;

use crate::{player::PlayerId, util::Vector2i};

#[derive(Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsEnum)]
pub enum EdgeValue {
    Set(PlayerId),
    Unset,
}

#[derive(Serialize, Deserialize, Clone, Copy, JsEnum)]
pub enum Edge {
    /// A horizontal edge. A board has `width` of these horizontally and `height+1` vertically.
    Horizontal { x: u16, y: u16 },
    /// A vertical edge. A board has `width+1` of these horizontally and `height` vertically.
    Vertical { x: u16, y: u16 },
}

#[derive(Clone, Copy, PartialEq, Eq, Serialize, Deserialize, JsEnum)]
pub enum Cell {
    Claimed(PlayerId),
    Unclaimed,
}

#[wasm_bindgen]
pub struct Board {
    horizontal_edges: Vec<EdgeValue>,
    vertical_edges: Vec<EdgeValue>,
    cells: Vec<Cell>,
    width: usize,
    height: usize,
}

#[wasm_bindgen]
impl Board {
    /// Constructs a board with a given size.
    pub fn with_size(width: usize, height: usize) -> Self {
        let cells = vec![Cell::Unclaimed; width * height];
        let mut horizontal_edges = vec![EdgeValue::Unset; width * (height + 1)];
        let mut vertical_edges = vec![EdgeValue::Unset; (width + 1) * height];
        for i in 0..width {
            horizontal_edges[i] = EdgeValue::Set(PlayerId::System);
        }
        for i in width * (height - 1)..width * (height + 1) {
            horizontal_edges[i] = EdgeValue::Set(PlayerId::System);
        }
        vertical_edges
            .iter_mut()
            .step_by(width + 1)
            .for_each(|x| *x = EdgeValue::Set(PlayerId::System));
        vertical_edges
            .iter_mut()
            .skip(width)
            .step_by(width + 1)
            .for_each(|x| *x = EdgeValue::Set(PlayerId::System));

        Self {
            width,
            height,
            cells,
            horizontal_edges,
            vertical_edges,
        }
    }

    /// The board's width in cells.
    pub fn width(&self) -> usize {
        self.width
    }

    /// The board's height in cells.
    pub fn height(&self) -> usize {
        self.height
    }

    /// Gets the value of a given edge of the board, if it exists.
    pub fn get_edge(&self, edge: Edge) -> Option<EdgeValue> {
        self.is_edge_valid(edge).then(|| match edge {
            Edge::Horizontal { x, y } => {
                self.horizontal_edges[(x + y * self.width as u16) as usize]
            }
            Edge::Vertical { x, y } => {
                self.vertical_edges[(x + y * (self.width + 1) as u16) as usize]
            }
        })
    }

    pub fn set_edge(&mut self, edge: Edge, value: EdgeValue) -> bool {
        if !self.is_edge_valid(edge) {
            return false;
        }
        match edge {
            Edge::Horizontal { x, y } => {
                self.horizontal_edges[(x + y * self.width as u16) as usize] = value;
            }
            Edge::Vertical { x, y } => {
                self.vertical_edges[(x + y * (self.width + 1) as u16) as usize] = value;
            }
        }
        return true;
    }

    /// Gets the value of a given cell of the board, if it exists.
    pub fn get_cell(&self, pos: Vector2i) -> Option<Cell> {
        self.is_cell_valid(pos)
            .then(|| self.cells[(pos.x + pos.y * self.width as i32) as usize])
    }

    pub fn set_cell(&mut self, pos: Vector2i, value: Cell) -> bool {
        if !self.is_cell_valid(pos) {
            return false;
        }
        self.cells[(pos.x + pos.y * self.width as i32) as usize] = value;
        return true;
    }

    /// Checks if a given edge is valid in this board, i.e. exists within it.
    pub fn is_edge_valid(&self, edge: Edge) -> bool {
        match edge {
            Edge::Horizontal { x, y } if y < (self.height as u16) && x <= (self.width as u16) => {
                true
            }

            Edge::Vertical { x, y } if y <= (self.height as u16) && x < (self.width as u16) => true,

            _ => false,
        }
    }

    /// Checks if a given cell position is valid in this board, i.e. exists within it.
    pub fn is_cell_valid(&self, pos: Vector2i) -> bool {
        pos.x >= 0 && pos.y >= 0 && pos.x < self.width as i32 && pos.y < self.height as i32
    }
}
