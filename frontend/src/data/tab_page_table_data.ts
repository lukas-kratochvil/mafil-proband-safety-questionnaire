export enum TabType {
  WAITING_ROOM,
  RECENT_VISITS,
}

export interface ITabPageTableProps {
  type: TabType;
  header: string[];
  data: string[][];
}

export const waitingRoomTableData: ITabPageTableProps = {
  type: TabType.WAITING_ROOM,
  header: ["Datum registrace", "Proband", "Rodné číslo", "Datum narození", "Pohlaví", "Mateřský jazyk"],
  data: [
    [new Date().toDateString(), "Novák, Karel", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Novák, Karel", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Novák, Karel", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Novák, Karel", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Novák, Karel", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Novák, Karel", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
    [new Date().toDateString(), "Novák, Karel", "0123456789", new Date().toDateString(), "Muž", "Čeština"],
  ],
};

export const recentVisitsTableData: ITabPageTableProps = {
  type: TabType.RECENT_VISITS,
  header: ["Visit ID", "Proband", "Projekt", "Přístroj", "Zpracováno", "Zpracoval"],
  data: [
    ["123456", "Novák, Karel", "Projekt 1", "M1", new Date().toDateString(), "operatorXY"],
    ["123456", "Novák, Karel", "Projekt 1", "M1", new Date().toDateString(), "operatorXY"],
    ["123456", "Novák, Karel", "Projekt 1", "M1", new Date().toDateString(), "operatorXY"],
    ["123456", "Novák, Karel", "Projekt 1", "M1", new Date().toDateString(), "operatorXY"],
    ["123456", "Novák, Karel", "Projekt 1", "M1", new Date().toDateString(), "operatorXY"],
    ["123456", "Novák, Karel", "Projekt 1", "M1", new Date().toDateString(), "operatorXY"],
  ],
};
