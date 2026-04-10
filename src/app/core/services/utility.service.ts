import { Injectable } from '@angular/core';

export type TreeStatus = 'PLANTED' | 'GROWING' | 'HEALTHY' | 'WEAK' | 'DEAD';
export type GrowthStage = 'SEEDLING' | 'SAPLING' | 'YOUNG' | 'MATURE' | 'FLOWERING' | 'FRUITING';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  getTreeStatusColor(status: TreeStatus): string {
    const colors = {
      PLANTED: 'blue',
      GROWING: 'yellow',
      HEALTHY: 'green',
      WEAK: 'orange',
      DEAD: 'red'
    };
    return colors[status] || 'gray';
  }

  getPriorityColor(priority: Priority): string {
    const colors = {
      LOW: 'blue',
      MEDIUM: 'yellow',
      HIGH: 'orange',
      CRITICAL: 'red'
    };
    return colors[priority] || 'gray';
  }

  getInspectionStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      PENDING: 'blue',
      IN_PROGRESS: 'yellow',
      COMPLETED: 'green',
      MISSED: 'red'
    };
    return colors[status] || 'gray';
  }

  calculateHealthPercentage(score: number): number {
    return (score / 10) * 100;
  }

  getHealthScoreColor(score: number): string {
    if (score >= 8) return 'green';
    if (score >= 6) return 'yellow';
    if (score >= 4) return 'orange';
    return 'red';
  }

  formatHealthScore(score: number): string {
    return `${score}/10`;
  }

  calculateSurvivalRate(trees: any[]): number {
    if (!trees || trees.length === 0) return 0;
    const dead = trees.filter(t => t.status === 'DEAD').length;
    const survivalRate = ((trees.length - dead) / trees.length) * 100;
    return Math.round(survivalRate * 10) / 10; // Round to 1 decimal place
  }

  getTreeStatusDistribution(trees: any[]) {
    if (!trees || trees.length === 0) {
      return {
        PLANTED: 0,
        GROWING: 0,
        HEALTHY: 0,
        WEAK: 0,
        DEAD: 0,
        total: 0
      };
    }

    const distribution = {
      PLANTED: trees.filter(t => t.status === 'PLANTED').length,
      GROWING: trees.filter(t => t.status === 'GROWING').length,
      HEALTHY: trees.filter(t => t.status === 'HEALTHY').length,
      WEAK: trees.filter(t => t.status === 'WEAK').length,
      DEAD: trees.filter(t => t.status === 'DEAD').length,
      total: trees.length
    };

    return distribution;
  }

  formatLocationString(lat: number, lng: number): string {
    return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatDateTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getRelativeTime(date: Date | string): string {
    const now = new Date();
    const target = new Date(date);
    const diffMs = now.getTime() - target.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  camelToKebab(str: string): string {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }
}
