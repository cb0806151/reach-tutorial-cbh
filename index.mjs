import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

(async () => {
  const stdlib = await loadStdlib(process.env);
  const startingBalance = stdlib.parseCurrency(100);

  const alice = await stdlib.newTestAccount(startingBalance);
  const bob = await stdlib.newTestAccount(startingBalance);

  const ctcAlice = alice.deploy(backend);
  const ctcBob = bob.attach(backend, ctcAlice.getInfo());

  const fmt = (x) => stdlib.formatCurrency(x, 4);
  const getBalance = async (who) => fmt(await stdlib.balanceOf(who));

  const beforeAlice = await getBalance(alice);
  const beforeBob = await getBalance(bob);

  const HAND = ['Rock', 'Paper', 'Scissors'];
  const OUTCOME = ['Bob wins', 'Draw', 'Alice wins'];
  const Player = (Who) => ({
    ...stdlib.hasRandom,
    getHand: async () => {
      const hand = Math.floor(Math.random() * 3);
      console.log(`${Who} played ${HAND[hand]}`);
      if ( Math.random() <= 0.01 ) {
        for ( let i = 0; i < 10; i++ ) {
          console.log(` ${Who} takes their sweet time sending it back...`);
          await stdlib.wait(1);
        }
      }
      return hand;
    },
    seeOutcome: (outcome) => {
      console.log(`${Who} saw outcome ${OUTCOME[outcome]}`);
    },
    informTimeout: () => {
      console.log(`${Who} observed a timeout`);
    },
  });

  const aliceActions = {
    ...Player('Alice'),
    wager: stdlib.parseCurrency(5),
  }

  const bobActions = {
    ...Player('Bob'),
    acceptWager: (amt) => {
      console.log(`Bob accepts the wager of ${fmt(amt)}`)
    }
  }

  await Promise.all([
    backend.Alice(ctcAlice, aliceActions),
    backend.Bob(ctcBob, bobActions),
  ]);

  const afterAlice = await getBalance(alice);
  const afterBob = await getBalance(bob);

  console.log(`Alice went from ${beforeAlice} to ${afterAlice}.`);
  console.log(`Bob went from ${beforeBob} to ${afterBob}.`);
})();
