import { useReducer } from 'react';

const initialScore = [
  {
    id: 1,
    score: 0,
    name: "John",
  },
  {
    id: 2,
    score: 0,
    name: "Sally",
  },
];

type Player = {
  id: number;
  score: number;
  name: string;
};

type Action = {
  type: "INCREASE";
  id: number;
};

const reducer = (state: Player[], action: Action): Player[] => {
  switch (action.type) {
    case "INCREASE":
      return state.map((player) => {
        if (player.id === action.id) {
          return { ...player, score: player.score + 1 };
        } else {
          return player;
        }
      });
    default:
      return state;
  }
};

export function UseReducerTemplate() {
  const [score, dispatch] = useReducer(reducer, initialScore);

  const handleIncrease = (player:Player) => {
    dispatch({ type: "INCREASE", id: player.id });
  };

  return (
    <>
      {score.map((player) => (
        <div key={player.id}>
          <label>
            <input
              type="button"
              onClick={() => handleIncrease(player)}
              value={player.name}
            />
            {player.score}
          </label>
        </div>
      ))}
    </>
  );
}
