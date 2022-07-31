export enum TabType {
  WAITING_ROOM,
  LAST_VISITS,
}

export interface ITabPageTableProps {
  type: TabType;
  header: string[];
  data: string[][];
  actionButtonTitles: string[];
}

export const waitingRoomTableData: ITabPageTableProps = {
  type: TabType.WAITING_ROOM,
  header: ["Registrován/a", "Proband", "Rodné číslo", "Datum narození", "Pohlaví", "Mateřský jazyk"],
  data: [
    [new Date().toDateString(), "Novák, Karel", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Novák, Karel", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Novák, Karel", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Novák, Karel", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Novák, Karel", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Novák, Karel", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Novák, Karel", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Novák, Karel", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Novák, Karel", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
  ],
  actionButtonTitles: ["Zpracovat"],
};
