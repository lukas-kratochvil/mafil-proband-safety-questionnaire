export enum TabType {
  WAITING_ROOM,
  LAST_VISITS,
}

interface IWaitingRoomTableDataProps {
  type: TabType;
  header: string[];
  data: string[][];
  actionButtonTitles: string[];
};

export const waitingRoomTableData: IWaitingRoomTableDataProps = {
  type: TabType.WAITING_ROOM,
  header: ["Registrován/a", "Jméno", "Příjmení", "Rodné číslo", "Datum narození", "Pohlaví", "Mateřský jazyk"],
  data: [
    [new Date().toDateString(), "Karel", "Novák", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Karel", "Novák", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Karel", "Novák", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Karel", "Novák", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Karel", "Novák", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Karel", "Novák", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Karel", "Novák", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Karel", "Novák", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Karel", "Novák", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
  ],
  actionButtonTitles: ["Editovat"],
};
