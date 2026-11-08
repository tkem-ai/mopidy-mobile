import { Injectable, inject } from '@angular/core';

import { Model, TlTrack } from '../models';
import { ConnectionService } from './connection.service';

export type Action = 'play' | 'next' | 'add' | 'replace';

function addParams(obj: Model | Model[], pos?: number | null) {
  const params: { uris: string[]; at_position?: number } = {
    uris: Array.isArray(obj) ? obj.map((model) => model.uri) : [obj.uri],
  };
  if (typeof pos === 'number') {
    params.at_position = pos;
  }
  return params;
}

/** Common actions on tracks and other library items. */
@Injectable({ providedIn: 'root' })
export class ActionsService {
  private readonly connection = inject(ConnectionService);

  private defaultAction: Action = 'play';

  add(obj: Model | Model[]): Promise<TlTrack[]> {
    return this.connection.call((mopidy) => mopidy.tracklist.add(addParams(obj)));
  }

  addToPlaylist(uri: string, obj: Model): Promise<unknown> {
    return this.connection.call(async (mopidy) => {
      const result = await mopidy.library.lookup({ uris: [obj.uri] });
      const tracks = result[obj.uri] || [];
      const playlist = await mopidy.playlists.lookup({ uri });
      playlist.tracks = [...(playlist.tracks || []), ...tracks];
      return mopidy.playlists.save({ playlist });
    });
  }

  play(obj: Model | Model[]): Promise<unknown> {
    return this.connection.call(async (mopidy) => {
      const tlTracks: TlTrack[] = await mopidy.tracklist.add(addParams(obj, await this.nextPosition(mopidy)));
      return mopidy.playback.play({ tlid: tlTracks[0].tlid });
    });
  }

  next(obj: Model | Model[]): Promise<TlTrack[]> {
    return this.connection.call(async (mopidy) =>
      mopidy.tracklist.add(addParams(obj, await this.nextPosition(mopidy))),
    );
  }

  replace(obj: Model | Model[]): Promise<unknown> {
    return this.connection.call(async (mopidy) => {
      await mopidy.tracklist.clear();
      const tlTracks: TlTrack[] = await mopidy.tracklist.add(addParams(obj));
      return mopidy.playback.play({ tlid: tlTracks[0].tlid });
    });
  }

  /** Perform the user's default action. */
  default(obj: Model | Model[]): Promise<unknown> {
    return this[this.defaultAction](obj);
  }

  getDefault(): Action {
    return this.defaultAction;
  }

  setDefault(action: string): void {
    if (['play', 'next', 'add', 'replace'].includes(action)) {
      this.defaultAction = action as Action;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async nextPosition(mopidy: any): Promise<number | null> {
    const tlTrack = await mopidy.playback.getCurrentTlTrack();
    const index = tlTrack ? await mopidy.tracklist.index({ tl_track: tlTrack }) : null;
    return typeof index === 'number' ? index + 1 : null;
  }
}
